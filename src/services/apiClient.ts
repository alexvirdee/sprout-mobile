/**
 * apiClient — a thin fetch wrapper that:
 *  - prefixes the API base URL (env.apiBaseUrl),
 *  - attaches the bearer token from secure storage,
 *  - surfaces failures as a typed ApiError,
 *  - clears the session + notifies on a 401 for an authenticated request.
 */

import { env } from '@/config/env';
import { ApiError } from '@app-types/api';
import { getToken, clearToken } from './secureStorage';

// Any JSON-serializable object/array body. `object` lets typed payload
// interfaces (which lack an index signature) pass without casting.
type Json = object;

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: Json;
  /** Attach the bearer token + treat a 401 as session loss. Default true. */
  auth?: boolean;
}

let onUnauthorized: (() => void) | null = null;

/** Let the auth store know when the session is gone (invalid/expired token). */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

async function parse<T>(res: Response): Promise<T> {
  const text = await res.text();
  const data = text ? JSON.parse(text) : null;
  if (!res.ok) {
    throw new ApiError({
      message: (data && (data.message as string)) || `Request failed (${res.status})`,
      status: res.status,
      details: data,
    });
  }
  return data as T;
}

async function send<T>(path: string, options: RequestOptions): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const token = auth ? await getToken() : null;

  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth) {
    // Token missing/expired/invalid — drop it and let the store sign out.
    await clearToken();
    onUnauthorized?.();
  }

  return parse<T>(res);
}

export const apiClient = {
  get: <T>(path: string, options: RequestOptions = {}) =>
    send<T>(path, { ...options, method: 'GET' }),
  post: <T>(path: string, body?: Json, options: RequestOptions = {}) =>
    send<T>(path, { ...options, method: 'POST', body }),
  patch: <T>(path: string, body?: Json, options: RequestOptions = {}) =>
    send<T>(path, { ...options, method: 'PATCH', body }),
  put: <T>(path: string, body?: Json, options: RequestOptions = {}) =>
    send<T>(path, { ...options, method: 'PUT', body }),
  delete: <T>(path: string, options: RequestOptions = {}) =>
    send<T>(path, { ...options, method: 'DELETE' }),
};

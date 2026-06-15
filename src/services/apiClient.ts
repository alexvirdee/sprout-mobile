/**
 * apiClient — a thin fetch wrapper that:
 *  - prefixes the API base URL,
 *  - attaches the bearer access token,
 *  - transparently refreshes once on a 401 and retries,
 *  - surfaces failures as a typed ApiError.
 *
 * The refresh call uses raw fetch (not this wrapper) to avoid recursion.
 */

import { env } from '@/config/env';
import { ApiError, AuthTokens } from '@app-types/api';
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from './secureStorage';

type Json = Record<string, unknown> | unknown[];

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: Json;
  /** Skip auth header + refresh handling (used by auth endpoints). */
  auth?: boolean;
}

let onUnauthorized: (() => void) | null = null;

/** Let the auth store know when the session is irrecoverably gone. */
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

async function refreshTokens(): Promise<boolean> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${env.apiBaseUrl}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const data = (await res.json()) as { tokens?: AuthTokens };
    if (!data.tokens) return false;
    await setTokens(data.tokens);
    return true;
  } catch {
    return false;
  }
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

async function send<T>(path: string, options: RequestOptions, retry = true): Promise<T> {
  const { body, auth = true, headers, ...rest } = options;
  const token = auth ? await getAccessToken() : null;

  const res = await fetch(`${env.apiBaseUrl}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401 && auth && retry) {
    const refreshed = await refreshTokens();
    if (refreshed) return send<T>(path, options, false);
    await clearTokens();
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

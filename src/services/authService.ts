/**
 * authService — pure API calls for authentication. No state here; the auth
 * store orchestrates these with token storage. Logout is client-side (the store
 * deletes the stored token), so there is no logout request.
 */

import { apiClient } from './apiClient';
import { AuthResponse, GoogleAuthPayload, LoginPayload, SignupPayload } from '@app-types/api';
import { User } from '@app-types/models';

export const authService = {
  signup: (payload: SignupPayload) =>
    apiClient.post<AuthResponse>('/auth/signup', payload, { auth: false }),

  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', payload, { auth: false }),

  me: () => apiClient.get<{ user: User }>('/auth/me'),

  /** Google groundwork — not wired to the UI yet. */
  googleAuth: (payload: GoogleAuthPayload) =>
    apiClient.post<AuthResponse>('/auth/google', payload, { auth: false }),

  requestPasswordReset: (email: string) =>
    apiClient.post<{ ok: true }>('/auth/forgot-password', { email }, { auth: false }),
};

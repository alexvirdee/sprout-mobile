/**
 * authService — pure API calls for authentication. No state here; the auth
 * store orchestrates these with token storage.
 */

import { apiClient } from './apiClient';
import {
  AuthResponse,
  GoogleAuthPayload,
  LoginPayload,
  SignupPayload,
} from '@app-types/api';
import { User } from '@app-types/models';

export const authService = {
  login: (payload: LoginPayload) =>
    apiClient.post<AuthResponse>('/auth/login', payload, { auth: false }),

  signup: (payload: SignupPayload) =>
    apiClient.post<AuthResponse>('/auth/register', payload, { auth: false }),

  /** Exchange a Google ID token for a Sprout session (backend groundwork). */
  googleAuth: (payload: GoogleAuthPayload) =>
    apiClient.post<AuthResponse>('/auth/google', payload, { auth: false }),

  me: () => apiClient.get<{ user: User }>('/auth/me'),

  logout: (refreshToken: string) =>
    apiClient.post<{ ok: true }>('/auth/logout', { refreshToken }),

  requestPasswordReset: (email: string) =>
    apiClient.post<{ ok: true }>('/auth/forgot-password', { email }, { auth: false }),
};

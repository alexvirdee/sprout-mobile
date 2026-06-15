/**
 * API contract types shared by the service layer.
 */

import { User } from './models';

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

export interface ApiErrorShape {
  message: string;
  status: number;
  details?: unknown;
}

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor({ message, status, details }: ApiErrorShape) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface SignupPayload {
  name: string;
  email: string;
  password: string;
}

export interface GoogleAuthPayload {
  idToken: string;
}

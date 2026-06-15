/**
 * API contract types shared by the service layer. Auth uses a single JWT.
 */

import { User } from './models';

/** Response from POST /auth/signup and /auth/login. */
export interface AuthResponse {
  token: string;
  user: User;
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

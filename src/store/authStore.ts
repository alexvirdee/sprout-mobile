/**
 * authStore — the single source of truth for the session. Orchestrates the
 * auth service with secure token storage. State: status, user, token, error.
 *
 * `demoSignIn` lets you explore the app offline (no backend, no token) — handy
 * during development and for design review.
 */

import { create } from 'zustand';

import { authService } from '@services/authService';
import { setUnauthorizedHandler } from '@services/apiClient';
import { clearToken, getToken, setToken } from '@services/secureStorage';
import { ApiError } from '@app-types/api';
import { User } from '@app-types/models';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: Status;
  user: User | null;
  token: string | null;
  isDemo: boolean;
  error: string | null;

  isAuthenticated: () => boolean;
  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  googleSignIn: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  demoSignIn: () => void;
  clearError: () => void;
}

const DEMO_USER: User = {
  id: 'demo',
  name: 'Maya Flores',
  email: 'maya@sprout.app',
  avatar: null,
  authProvider: 'credentials',
  createdAt: new Date().toISOString(),
};

function messageFor(err: unknown, fallback: string): string {
  return err instanceof ApiError ? err.message : fallback;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'loading',
  user: null,
  token: null,
  isDemo: false,
  error: null,

  isAuthenticated: () => get().status === 'authenticated',

  bootstrap: async () => {
    // Sign the session out cleanly if a token turns out to be invalid/expired.
    setUnauthorizedHandler(() => set({ status: 'unauthenticated', user: null, token: null, isDemo: false }));

    try {
      const token = await getToken();
      if (!token) {
        set({ status: 'unauthenticated', user: null, token: null });
        return;
      }
      const { user } = await authService.me();
      set({ status: 'authenticated', user, token });
    } catch {
      await clearToken();
      set({ status: 'unauthenticated', user: null, token: null });
    }
  },

  login: async (email, password) => {
    set({ error: null });
    try {
      const { token, user } = await authService.login({ email: email.trim().toLowerCase(), password });
      await setToken(token);
      set({ status: 'authenticated', user, token, isDemo: false, error: null });
    } catch (err) {
      set({ error: messageFor(err, 'We could not sign you in. Please try again.') });
      throw err;
    }
  },

  signup: async (name, email, password) => {
    set({ error: null });
    try {
      const { token, user } = await authService.signup({ name: name.trim(), email: email.trim().toLowerCase(), password });
      await setToken(token);
      set({ status: 'authenticated', user, token, isDemo: false, error: null });
    } catch (err) {
      set({ error: messageFor(err, 'We could not create your account. Please try again.') });
      throw err;
    }
  },

  googleSignIn: async (idToken) => {
    set({ error: null });
    const { token, user } = await authService.googleAuth({ idToken });
    await setToken(token);
    set({ status: 'authenticated', user, token, isDemo: false, error: null });
  },

  logout: async () => {
    // Stateless JWT — logout is just dropping the local token.
    if (!get().isDemo) await clearToken();
    set({ status: 'unauthenticated', user: null, token: null, isDemo: false, error: null });
  },

  getCurrentUser: async () => {
    if (get().isDemo) return;
    const { user } = await authService.me();
    set({ user });
  },

  demoSignIn: () => set({ status: 'authenticated', user: DEMO_USER, token: null, isDemo: true, error: null }),

  clearError: () => set({ error: null }),
}));

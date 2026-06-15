/**
 * authStore — the single source of truth for the session. Orchestrates the
 * auth service with secure token storage and exposes the actions the spec
 * calls for: login, signup, googleSignIn, logout, getCurrentUser.
 *
 * `demoSignIn` lets you explore the app offline (no backend, no tokens) — handy
 * during development and for design review.
 */

import { create } from 'zustand';

import { authService } from '@services/authService';
import { setUnauthorizedHandler } from '@services/apiClient';
import { clearTokens, getAccessToken, getRefreshToken, setTokens } from '@services/secureStorage';
import { User } from '@app-types/models';

type Status = 'loading' | 'authenticated' | 'unauthenticated';

interface AuthState {
  status: Status;
  user: User | null;
  isDemo: boolean;

  bootstrap: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  googleSignIn: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  getCurrentUser: () => Promise<void>;
  demoSignIn: () => void;
}

const DEMO_USER: User = {
  id: 'demo',
  name: 'Maya Flores',
  email: 'maya@sprout.app',
  authProvider: 'local',
  createdAt: new Date().toISOString(),
};

export const useAuthStore = create<AuthState>((set, get) => ({
  status: 'loading',
  user: null,
  isDemo: false,

  bootstrap: async () => {
    // Sign the session out cleanly if a token refresh ultimately fails.
    setUnauthorizedHandler(() => set({ status: 'unauthenticated', user: null, isDemo: false }));

    try {
      const token = await getAccessToken();
      if (!token) {
        set({ status: 'unauthenticated', user: null });
        return;
      }
      const { user } = await authService.me();
      set({ status: 'authenticated', user });
    } catch {
      await clearTokens();
      set({ status: 'unauthenticated', user: null });
    }
  },

  login: async (email, password) => {
    const { user, tokens } = await authService.login({ email, password });
    await setTokens(tokens);
    set({ status: 'authenticated', user, isDemo: false });
  },

  signup: async (name, email, password) => {
    const { user, tokens } = await authService.signup({ name, email, password });
    await setTokens(tokens);
    set({ status: 'authenticated', user, isDemo: false });
  },

  googleSignIn: async (idToken) => {
    const { user, tokens } = await authService.googleAuth({ idToken });
    await setTokens(tokens);
    set({ status: 'authenticated', user, isDemo: false });
  },

  logout: async () => {
    if (!get().isDemo) {
      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) await authService.logout(refreshToken);
      } catch {
        // best-effort; clear locally regardless
      }
      await clearTokens();
    }
    set({ status: 'unauthenticated', user: null, isDemo: false });
  },

  getCurrentUser: async () => {
    if (get().isDemo) return;
    const { user } = await authService.me();
    set({ user });
  },

  demoSignIn: () => set({ status: 'authenticated', user: DEMO_USER, isDemo: true }),
}));

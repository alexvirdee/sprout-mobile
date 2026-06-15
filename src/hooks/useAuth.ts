/**
 * useAuth — ergonomic selector over the auth store. Components get the session
 * (user, token, derived flags, error) plus the actions.
 */

import { useAuthStore } from '@store/authStore';

export function useAuth() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const token = useAuthStore((s) => s.token);
  const isDemo = useAuthStore((s) => s.isDemo);
  const error = useAuthStore((s) => s.error);

  return {
    status,
    user,
    token,
    isDemo,
    error,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login: useAuthStore((s) => s.login),
    signup: useAuthStore((s) => s.signup),
    googleSignIn: useAuthStore((s) => s.googleSignIn),
    logout: useAuthStore((s) => s.logout),
    getCurrentUser: useAuthStore((s) => s.getCurrentUser),
    demoSignIn: useAuthStore((s) => s.demoSignIn),
    clearError: useAuthStore((s) => s.clearError),
  };
}

/**
 * useAuth — ergonomic selector over the auth store. Components get the session
 * plus the actions (login, signup, googleSignIn, logout, getCurrentUser).
 */

import { useAuthStore } from '@store/authStore';

export function useAuth() {
  const status = useAuthStore((s) => s.status);
  const user = useAuthStore((s) => s.user);
  const isDemo = useAuthStore((s) => s.isDemo);

  return {
    status,
    user,
    isDemo,
    isAuthenticated: status === 'authenticated',
    login: useAuthStore((s) => s.login),
    signup: useAuthStore((s) => s.signup),
    googleSignIn: useAuthStore((s) => s.googleSignIn),
    logout: useAuthStore((s) => s.logout),
    getCurrentUser: useAuthStore((s) => s.getCurrentUser),
    demoSignIn: useAuthStore((s) => s.demoSignIn),
  };
}

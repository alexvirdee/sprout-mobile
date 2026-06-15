/**
 * useProfile — the signed-in user from the auth store (the app-wide source of
 * truth) plus a refresh that re-fetches /users/me.
 */

import { useAuthStore } from '@store/authStore';

export function useProfile() {
  const user = useAuthStore((s) => s.user);
  const isDemo = useAuthStore((s) => s.isDemo);
  const refresh = useAuthStore((s) => s.getCurrentUser);
  return { user, isDemo, refresh };
}

/**
 * useUpdateTheme — persist the user's theme preference (light / dark / system)
 * with an optimistic update. Writing it to the auth store flips ThemeProvider's
 * resolved scheme immediately; the server is the durable source of truth.
 */

import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@store/authStore';
import { ThemePreference, User } from '@app-types/models';
import { profileService } from '../services/profile.service';

export function useUpdateTheme() {
  const setUser = useAuthStore((s) => s.setUser);
  const isDemo = useAuthStore((s) => s.isDemo);

  return useMutation<User, Error, ThemePreference, { prev: User | null }>({
    mutationFn: async (themePreference) => {
      const current = useAuthStore.getState().user;
      if (isDemo) return { ...(current as User), themePreference } as User;
      return profileService.updateTheme(themePreference);
    },
    onMutate: (themePreference) => {
      const prev = useAuthStore.getState().user;
      if (prev) setUser({ ...prev, themePreference });
      return { prev };
    },
    onError: (_err, _pref, ctx) => {
      if (ctx?.prev) setUser(ctx.prev);
    },
    onSuccess: (user) => setUser(user),
  });
}

/**
 * useNotificationPreferences — read the user's notification toggles and flip
 * them with an optimistic update (PATCH /users/notifications), synced to the
 * auth store. Demo mode updates locally. Reminder *scheduling* is Phase 2; this
 * persists the preferences that will drive it.
 */

import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@store/authStore';
import { User } from '@app-types/models';
import { profileService } from '../services/profile.service';
import { DEFAULT_NOTIFICATION_PREFERENCES, NotificationPreferences } from '../types/profile.types';

export function useNotificationPreferences() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const isDemo = useAuthStore((s) => s.isDemo);

  const prefs = user?.notificationPreferences ?? DEFAULT_NOTIFICATION_PREFERENCES;

  const mutation = useMutation<User, Error, Partial<NotificationPreferences>, { prev: User | null }>({
    mutationFn: async (partial) => {
      const current = useAuthStore.getState().user;
      if (isDemo) {
        const merged = { ...(current?.notificationPreferences ?? DEFAULT_NOTIFICATION_PREFERENCES), ...partial };
        return { ...(current as User), notificationPreferences: merged } as User;
      }
      return profileService.updateNotifications(partial);
    },
    onMutate: (partial) => {
      const prev = useAuthStore.getState().user;
      if (prev) {
        const merged = { ...(prev.notificationPreferences ?? DEFAULT_NOTIFICATION_PREFERENCES), ...partial };
        setUser({ ...prev, notificationPreferences: merged });
      }
      return { prev };
    },
    onError: (_err, _partial, ctx) => {
      if (ctx?.prev) setUser(ctx.prev);
    },
    onSuccess: (user) => setUser(user),
  });

  const toggle = (key: keyof NotificationPreferences, value: boolean) =>
    mutation.mutate({ [key]: value } as Partial<NotificationPreferences>);

  return { prefs, toggle, isPending: mutation.isPending };
}

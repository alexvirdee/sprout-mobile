/**
 * useUpdateProfile — PATCH /users/me with an optimistic update: the merged user
 * is written to the auth store immediately (so the header/avatar change at
 * once), rolled back on error, and replaced with the server truth on success.
 * In demo mode it updates locally without hitting the API.
 */

import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@store/authStore';
import { User } from '@app-types/models';
import { profileService } from '../services/profile.service';
import { UpdateProfilePayload } from '../types/profile.types';

interface Ctx {
  prev: User | null;
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser);
  const isDemo = useAuthStore((s) => s.isDemo);

  return useMutation<User, Error, UpdateProfilePayload, Ctx>({
    mutationFn: async (payload) => {
      const current = useAuthStore.getState().user;
      if (isDemo) return { ...(current as User), ...payload } as User;
      return profileService.updateProfile(payload);
    },
    onMutate: (payload) => {
      const prev = useAuthStore.getState().user;
      if (prev) setUser({ ...prev, ...payload });
      return { prev };
    },
    onError: (_err, _payload, ctx) => {
      if (ctx?.prev) setUser(ctx.prev);
    },
    onSuccess: (user) => setUser(user),
  });
}

/**
 * useAvatar — upload or remove the profile photo. Uploads go to GridFS via the
 * server; on success the updated user (with its new `avatar` URL) is written to
 * the auth store so the header/avatar update everywhere. Demo mode updates the
 * local URI only (no server).
 */

import { useMutation } from '@tanstack/react-query';

import { useAuthStore } from '@store/authStore';
import { User } from '@app-types/models';
import { profileService } from '../services/profile.service';

export function useAvatar() {
  const setUser = useAuthStore((s) => s.setUser);
  const isDemo = useAuthStore((s) => s.isDemo);

  const upload = useMutation<User, Error, string>({
    mutationFn: async (uri) => {
      if (isDemo) {
        const current = useAuthStore.getState().user;
        return { ...(current as User), avatar: uri };
      }
      return profileService.uploadAvatar(uri);
    },
    onSuccess: (user) => setUser(user),
  });

  const remove = useMutation<User, Error, void>({
    mutationFn: async () => {
      if (isDemo) {
        const current = useAuthStore.getState().user;
        return { ...(current as User), avatar: null };
      }
      return profileService.removeAvatar();
    },
    onSuccess: (user) => setUser(user),
  });

  return { upload, remove, isPending: upload.isPending || remove.isPending };
}

/**
 * profile.service — typed wrappers over /api/users. All requests are auth-scoped
 * to the signed-in user server-side.
 *
 * Avatars are uploaded as multipart to /users/avatar and stored in MongoDB via
 * GridFS; the server responds with the user whose `avatar` is a serving URL
 * (GET /api/users/avatar/:fileId). The rest of the app just reads `user.avatar`.
 */

import { apiClient } from '@services/apiClient';
import { getToken } from '@services/secureStorage';
import { env } from '@/config/env';
import { User } from '@app-types/models';
import {
  AchievementsResponse,
  NotificationPreferences,
  ProfileStats,
  ThemePreference,
  UpdateProfilePayload,
} from '../types/profile.types';

function mimeForUri(uri: string): { name: string; type: string } {
  const name = uri.split('/').pop() || 'avatar.jpg';
  const ext = name.split('.').pop()?.toLowerCase();
  const type =
    ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'heic' ? 'image/heic' : 'image/jpeg';
  return { name, type };
}

export const profileService = {
  getMe: () => apiClient.get<{ user: User }>('/users/me').then((r) => r.user),

  updateProfile: (payload: UpdateProfilePayload) =>
    apiClient.patch<{ user: User }>('/users/me', payload).then((r) => r.user),

  updateTheme: (themePreference: ThemePreference) =>
    apiClient.patch<{ user: User }>('/users/theme', { themePreference }).then((r) => r.user),

  updateNotifications: (prefs: Partial<NotificationPreferences>) =>
    apiClient.patch<{ user: User }>('/users/notifications', prefs).then((r) => r.user),

  updatePreferences: (payload: {
    themePreference?: ThemePreference;
    notificationPreferences?: Partial<NotificationPreferences>;
  }) => apiClient.patch<{ user: User }>('/users/preferences', payload).then((r) => r.user),

  getStats: () => apiClient.get<{ stats: ProfileStats }>('/users/stats').then((r) => r.stats),

  getAchievements: () => apiClient.get<AchievementsResponse>('/users/achievements'),

  /** Multipart upload of a local image URI → GridFS. Returns the updated user. */
  uploadAvatar: async (uri: string): Promise<User> => {
    const token = await getToken();
    const { name, type } = mimeForUri(uri);
    const form = new FormData();
    // React Native's FormData accepts this file descriptor at runtime.
    form.append('avatar', { uri, name, type } as unknown as Blob);

    const res = await fetch(`${env.apiBaseUrl}/users/avatar`, {
      method: 'POST',
      // No Content-Type — let fetch set the multipart boundary.
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Avatar upload failed (${res.status})`);
    }
    const data = (await res.json()) as { user: User };
    return data.user;
  },

  removeAvatar: () => apiClient.delete<{ user: User }>('/users/avatar').then((r) => r.user),
};

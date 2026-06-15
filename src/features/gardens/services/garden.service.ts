/**
 * garden.service — typed wrappers over the /api/gardens endpoints. All requests
 * carry the auth bearer token (handled by apiClient) and are scoped server-side
 * to the signed-in user.
 */

import { apiClient } from '@services/apiClient';
import { Garden, GardenPayload } from '../types/garden.types';

export const gardenService = {
  list: () => apiClient.get<{ gardens: Garden[] }>('/gardens').then((r) => r.gardens),

  get: (id: string) => apiClient.get<{ garden: Garden }>(`/gardens/${id}`).then((r) => r.garden),

  create: (payload: GardenPayload) =>
    apiClient.post<{ garden: Garden }>('/gardens', payload).then((r) => r.garden),

  update: (id: string, payload: Partial<GardenPayload>) =>
    apiClient.patch<{ garden: Garden }>(`/gardens/${id}`, payload).then((r) => r.garden),

  /** Soft-archive (DELETE) — server sets archivedAt and excludes it from list. */
  archive: (id: string) =>
    apiClient.delete<{ garden: Garden; archived: boolean }>(`/gardens/${id}`).then((r) => r.garden),
};

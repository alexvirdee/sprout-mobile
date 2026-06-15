/**
 * plant.service — typed wrappers over /api/plants. All requests carry the auth
 * token (apiClient) and are scoped server-side to the signed-in user.
 */

import { apiClient } from '@services/apiClient';
import { Plant, PlantPayload } from '../types/plant.types';

export const plantService = {
  list: (gardenId?: string) =>
    apiClient
      .get<{ plants: Plant[] }>(`/plants${gardenId ? `?gardenId=${encodeURIComponent(gardenId)}` : ''}`)
      .then((r) => r.plants),

  get: (id: string) => apiClient.get<{ plant: Plant }>(`/plants/${id}`).then((r) => r.plant),

  create: (payload: PlantPayload) =>
    apiClient.post<{ plant: Plant }>('/plants', payload).then((r) => r.plant),

  update: (id: string, payload: Partial<PlantPayload>) =>
    apiClient.patch<{ plant: Plant }>(`/plants/${id}`, payload).then((r) => r.plant),

  archive: (id: string) =>
    apiClient.delete<{ plant: Plant; archived: boolean }>(`/plants/${id}`).then((r) => r.plant),
};

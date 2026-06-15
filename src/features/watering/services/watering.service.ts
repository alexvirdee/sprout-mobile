/**
 * watering.service — typed wrappers over /api/watering. All requests carry the
 * auth token (apiClient) and are scoped server-side to the signed-in user.
 */

import { apiClient } from '@services/apiClient';
import { WateringLog, WateringPayload, WateringStats } from '../types/watering.types';

export const wateringService = {
  list: (params?: { gardenId?: string; plantId?: string }) => {
    const q = new URLSearchParams();
    if (params?.gardenId) q.set('gardenId', params.gardenId);
    if (params?.plantId) q.set('plantId', params.plantId);
    const qs = q.toString();
    return apiClient.get<{ logs: WateringLog[] }>(`/watering${qs ? `?${qs}` : ''}`).then((r) => r.logs);
  },

  recent: () => apiClient.get<{ logs: WateringLog[] }>('/watering/recent').then((r) => r.logs),

  stats: () => apiClient.get<WateringStats>('/watering/stats'),

  create: (payload: WateringPayload) =>
    apiClient.post<{ log: WateringLog }>('/watering', payload).then((r) => r.log),

  get: (id: string) => apiClient.get<{ log: WateringLog }>(`/watering/${id}`).then((r) => r.log),

  remove: (id: string) => apiClient.delete<{ ok: true }>(`/watering/${id}`),
};

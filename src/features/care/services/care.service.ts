/**
 * care.service — typed wrappers over /api/care-tasks (+ plant care suggestions).
 * Auth-scoped server-side.
 */

import { apiClient } from '@services/apiClient';
import { CareSuggestion, CareTask, CareTaskListParams, CareTaskPayload } from '../types/care.types';

function toQuery(params?: CareTaskListParams): string {
  if (!params) return '';
  const q = new URLSearchParams();
  if (params.dueBefore) q.set('dueBefore', params.dueBefore);
  if (params.gardenId) q.set('gardenId', params.gardenId);
  if (params.plantId) q.set('plantId', params.plantId);
  if (params.status) q.set('status', params.status);
  const s = q.toString();
  return s ? `?${s}` : '';
}

export const careService = {
  list: (params?: CareTaskListParams) =>
    apiClient.get<{ tasks: CareTask[] }>(`/care-tasks${toQuery(params)}`).then((r) => r.tasks),

  get: (id: string) => apiClient.get<{ task: CareTask }>(`/care-tasks/${id}`).then((r) => r.task),

  create: (payload: CareTaskPayload) =>
    apiClient.post<{ task: CareTask }>('/care-tasks', payload).then((r) => r.task),

  update: (id: string, payload: Partial<CareTaskPayload>) =>
    apiClient.patch<{ task: CareTask }>(`/care-tasks/${id}`, payload).then((r) => r.task),

  complete: (id: string) =>
    apiClient.post<{ task: CareTask; next: CareTask | null }>(`/care-tasks/${id}/complete`),

  skip: (id: string) => apiClient.post<{ task: CareTask; next: CareTask | null }>(`/care-tasks/${id}/skip`),

  reschedule: (id: string, dueDate: string) =>
    apiClient.post<{ task: CareTask }>(`/care-tasks/${id}/reschedule`, { dueDate }).then((r) => r.task),

  remove: (id: string) => apiClient.delete<{ ok: true }>(`/care-tasks/${id}`),

  suggestions: (plantId: string) =>
    apiClient.get<{ suggestions: CareSuggestion[] }>(`/plants/${plantId}/care-suggestions`).then((r) => r.suggestions),

  enableSuggestions: (plantId: string, keys: string[]) =>
    apiClient
      .post<{ tasks: CareTask[] }>(`/plants/${plantId}/enable-care-suggestions`, { keys })
      .then((r) => r.tasks),
};

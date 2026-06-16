/**
 * journal.service — typed wrappers over /api/journal. Auth-scoped server-side.
 * Photos upload as multipart to /journal/:id/photo (GridFS) and come back as a
 * serving URL on `entry.photoUrl`, mirroring the avatar approach.
 */

import { apiClient } from '@services/apiClient';
import { getToken } from '@services/secureStorage';
import { env } from '@/config/env';
import { JournalEntry, JournalEntryPayload, JournalListParams } from '../types/journal.types';

function toQuery(params?: JournalListParams): string {
  if (!params) return '';
  const q = new URLSearchParams();
  if (params.gardenId) q.set('gardenId', params.gardenId);
  if (params.plantId) q.set('plantId', params.plantId);
  if (params.type) q.set('type', params.type);
  if (params.limit) q.set('limit', String(params.limit));
  const s = q.toString();
  return s ? `?${s}` : '';
}

function mimeForUri(uri: string): { name: string; type: string } {
  const name = uri.split('/').pop() || 'photo.jpg';
  const ext = name.split('.').pop()?.toLowerCase();
  const type =
    ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'heic' ? 'image/heic' : 'image/jpeg';
  return { name, type };
}

export const journalService = {
  list: (params?: JournalListParams) =>
    apiClient.get<{ entries: JournalEntry[] }>(`/journal${toQuery(params)}`).then((r) => r.entries),

  get: (id: string) => apiClient.get<{ entry: JournalEntry }>(`/journal/${id}`).then((r) => r.entry),

  create: (payload: JournalEntryPayload) =>
    apiClient.post<{ entry: JournalEntry }>('/journal', payload).then((r) => r.entry),

  update: (id: string, payload: Partial<JournalEntryPayload>) =>
    apiClient.patch<{ entry: JournalEntry }>(`/journal/${id}`, payload).then((r) => r.entry),

  remove: (id: string) => apiClient.delete<{ ok: true }>(`/journal/${id}`),

  /** Multipart upload of a local image URI → GridFS. Returns the updated entry. */
  uploadPhoto: async (id: string, uri: string): Promise<JournalEntry> => {
    const token = await getToken();
    const { name, type } = mimeForUri(uri);
    const form = new FormData();
    // React Native's FormData accepts this file descriptor at runtime.
    form.append('photo', { uri, name, type } as unknown as Blob);

    const res = await fetch(`${env.apiBaseUrl}/journal/${id}/photo`, {
      method: 'POST',
      // No Content-Type — let fetch set the multipart boundary.
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      throw new Error(text || `Photo upload failed (${res.status})`);
    }
    const data = (await res.json()) as { entry: JournalEntry };
    return data.entry;
  },
};

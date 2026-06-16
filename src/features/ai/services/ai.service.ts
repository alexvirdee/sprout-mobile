/**
 * ai.service — sends a plant photo to the backend (which calls the vision model;
 * the OpenAI key never touches the client). Multipart upload; surfaces the
 * backend's friendly error message on failure.
 */

import { getToken } from '@services/secureStorage';
import { env } from '@/config/env';
import { PlantIdentification } from '../types/ai.types';

function mimeForUri(uri: string): { name: string; type: string } {
  const name = uri.split('/').pop() || 'plant.jpg';
  const ext = name.split('.').pop()?.toLowerCase();
  const type =
    ext === 'png' ? 'image/png' : ext === 'webp' ? 'image/webp' : ext === 'heic' ? 'image/heic' : 'image/jpeg';
  return { name, type };
}

export const aiService = {
  identifyPlant: async (uri: string): Promise<PlantIdentification> => {
    const token = await getToken();
    const { name, type } = mimeForUri(uri);
    const form = new FormData();
    form.append('image', { uri, name, type } as unknown as Blob);

    const res = await fetch(`${env.apiBaseUrl}/ai/plant-identify`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: form,
    });

    if (!res.ok) {
      let message = 'We couldn’t identify that photo. Please try again.';
      try {
        const data = await res.json();
        if (data?.message) message = data.message as string;
      } catch {
        /* keep the friendly default */
      }
      throw new Error(message);
    }

    const data = (await res.json()) as { identification: PlantIdentification };
    return data.identification;
  },
};

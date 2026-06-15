/**
 * useWatering — watering history, optionally filtered to a garden or plant.
 */

import { useQuery } from '@tanstack/react-query';

import { wateringService } from '../services/watering.service';

export function useWatering(params?: { gardenId?: string; plantId?: string }) {
  return useQuery({
    queryKey: ['watering', 'list', params?.gardenId ?? null, params?.plantId ?? null],
    queryFn: () => wateringService.list(params),
  });
}

/**
 * usePlants — the user's active plants, optionally filtered to one garden.
 */

import { useQuery } from '@tanstack/react-query';

import { plantService } from '../services/plant.service';

export function usePlants(gardenId?: string) {
  return useQuery({
    queryKey: ['plants', gardenId ?? null],
    queryFn: () => plantService.list(gardenId),
  });
}

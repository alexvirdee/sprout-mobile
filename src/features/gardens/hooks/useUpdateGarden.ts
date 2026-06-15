/**
 * useUpdateGarden — update mutation for a given garden id. Writes the fresh
 * record into both the detail and list caches.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { gardenService } from '../services/garden.service';
import { Garden, GardenPayload } from '../types/garden.types';

export function useUpdateGarden(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<GardenPayload>) => gardenService.update(id, payload),
    onSuccess: (garden) => {
      qc.setQueryData(queryKeys.garden(id), garden);
      qc.setQueryData<Garden[]>(queryKeys.gardens, (prev) =>
        prev?.map((g) => (g.id === id ? garden : g)),
      );
      void qc.invalidateQueries({ queryKey: queryKeys.gardens });
    },
  });
}

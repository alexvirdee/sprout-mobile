/**
 * useCreateGarden — create mutation. Prepends the new garden into the list cache
 * and invalidates so the Garden tab reflects it immediately.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { gardenService } from '../services/garden.service';
import { Garden, GardenPayload } from '../types/garden.types';

export function useCreateGarden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: GardenPayload) => gardenService.create(payload),
    onSuccess: (garden) => {
      qc.setQueryData<Garden[]>(queryKeys.gardens, (prev) => (prev ? [garden, ...prev] : [garden]));
      void qc.invalidateQueries({ queryKey: queryKeys.gardens });
    },
  });
}

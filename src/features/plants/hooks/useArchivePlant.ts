/**
 * useArchivePlant — soft-archive mutation. Invalidates plant lists + the garden
 * (plantCount decremented) + gardens list.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { plantService } from '../services/plant.service';

export function useArchivePlant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => plantService.archive(id),
    onSuccess: (plant) => {
      void qc.invalidateQueries({ queryKey: ['plants'] });
      void qc.invalidateQueries({ queryKey: queryKeys.gardens });
      void qc.invalidateQueries({ queryKey: queryKeys.garden(plant.gardenId) });
    },
  });
}

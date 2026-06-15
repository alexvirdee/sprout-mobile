/**
 * useCreatePlant — create mutation. Invalidates plant lists + the garden (its
 * plantCount changed) + gardens list so Home and garden cards stay in sync.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { plantService } from '../services/plant.service';
import { PlantPayload } from '../types/plant.types';

export function useCreatePlant() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: PlantPayload) => plantService.create(payload),
    onSuccess: (plant) => {
      void qc.invalidateQueries({ queryKey: ['plants'] });
      void qc.invalidateQueries({ queryKey: queryKeys.gardens });
      void qc.invalidateQueries({ queryKey: queryKeys.garden(plant.gardenId) });
    },
  });
}

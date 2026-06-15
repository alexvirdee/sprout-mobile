/**
 * useUpdatePlant — update mutation for a plant id. Writes the fresh record into
 * the detail cache and invalidates the lists + parent garden.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { plantService } from '../services/plant.service';
import { PlantPayload } from '../types/plant.types';

export function useUpdatePlant(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<PlantPayload>) => plantService.update(id, payload),
    onSuccess: (plant) => {
      qc.setQueryData(queryKeys.plant(id), plant);
      void qc.invalidateQueries({ queryKey: ['plants'] });
      void qc.invalidateQueries({ queryKey: queryKeys.garden(plant.gardenId) });
    },
  });
}

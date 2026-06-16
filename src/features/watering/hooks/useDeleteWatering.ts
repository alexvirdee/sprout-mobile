/**
 * useDeleteWatering — remove a watering log (used for "undo"). The backend
 * recomputes garden/plant rollups, so we invalidate watering + gardens + plants
 * + stats to refresh everything that depended on it.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { wateringService } from '../services/watering.service';

export function useDeleteWatering() {
  const qc = useQueryClient();

  return useMutation<{ ok: true }, Error, string>({
    mutationFn: (id) => wateringService.remove(id),
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ['watering'] });
      void qc.invalidateQueries({ queryKey: queryKeys.gardens });
      void qc.invalidateQueries({ queryKey: ['plants'] });
      void qc.invalidateQueries({ queryKey: queryKeys.wateringStats });
    },
  });
}

/**
 * useArchiveGarden — soft-archive mutation. Removes the garden from the active
 * list cache on success.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { gardenService } from '../services/garden.service';
import { Garden } from '../types/garden.types';

export function useArchiveGarden() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => gardenService.archive(id),
    onSuccess: (garden) => {
      qc.setQueryData<Garden[]>(queryKeys.gardens, (prev) => prev?.filter((g) => g.id !== garden.id));
      void qc.invalidateQueries({ queryKey: queryKeys.gardens });
    },
  });
}

/**
 * useGarden — a single garden by id. Seeds from the gardens-list cache so the
 * detail screen renders instantly, then refetches the full record.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { gardenService } from '../services/garden.service';
import { Garden } from '../types/garden.types';

export function useGarden(id: string) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: queryKeys.garden(id),
    queryFn: () => gardenService.get(id),
    enabled: !!id,
    placeholderData: () =>
      qc.getQueryData<Garden[]>(queryKeys.gardens)?.find((g) => g.id === id),
  });
}

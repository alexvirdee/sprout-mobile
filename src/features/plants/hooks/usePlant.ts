/**
 * usePlant — a single plant by id, seeded from any cached plants list so the
 * detail screen renders instantly, then refetched.
 */

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { plantService } from '../services/plant.service';
import { Plant } from '../types/plant.types';

export function usePlant(id: string) {
  const qc = useQueryClient();
  return useQuery({
    queryKey: queryKeys.plant(id),
    queryFn: () => plantService.get(id),
    enabled: !!id,
    placeholderData: () => {
      const lists = qc.getQueriesData<Plant[]>({ queryKey: ['plants'] });
      for (const [, data] of lists) {
        const found = data?.find((p) => p.id === id);
        if (found) return found;
      }
      return undefined;
    },
  });
}

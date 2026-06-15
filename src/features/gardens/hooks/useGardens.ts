/**
 * useGardens — the signed-in user's active (non-archived) gardens.
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { gardenService } from '../services/garden.service';

export function useGardens() {
  return useQuery({
    queryKey: queryKeys.gardens,
    queryFn: gardenService.list,
  });
}

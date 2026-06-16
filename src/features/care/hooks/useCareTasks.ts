/**
 * useCareTasks / useCareTask — read care tasks (filterable) and a single task.
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { careService } from '../services/care.service';
import { CareTaskListParams } from '../types/care.types';

export function useCareTasks(params?: CareTaskListParams) {
  return useQuery({
    queryKey: [...queryKeys.careTasks, params ?? {}],
    queryFn: () => careService.list(params),
    staleTime: 0,
  });
}

export function useCareTask(id: string) {
  return useQuery({
    queryKey: queryKeys.careTask(id),
    queryFn: () => careService.get(id),
    enabled: !!id,
  });
}

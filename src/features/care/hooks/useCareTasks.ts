/**
 * useCareTasks / useCareTask — read care tasks (filterable) and a single task.
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { useAuthStore } from '@store/authStore';
import { careService } from '../services/care.service';
import { CareTaskListParams } from '../types/care.types';

export function useCareTasks(params?: CareTaskListParams) {
  const isDemo = useAuthStore((s) => s.isDemo);
  return useQuery({
    queryKey: [...queryKeys.careTasks, params ?? {}],
    queryFn: () => careService.list(params),
    enabled: !isDemo,
    staleTime: 0,
  });
}

export function useCareTask(id: string) {
  const isDemo = useAuthStore((s) => s.isDemo);
  return useQuery({
    queryKey: queryKeys.careTask(id),
    queryFn: () => careService.get(id),
    enabled: !!id && !isDemo,
  });
}

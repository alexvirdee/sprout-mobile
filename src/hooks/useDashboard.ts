/**
 * useDashboard — React Query hook feeding the Home screen. Gives the screen
 * data / isLoading / isError / refetch without it knowing the data source.
 */

import { useQuery } from '@tanstack/react-query';

import { gardenService } from '@features/garden/gardenService';
import { queryKeys } from '@services/queryClient';

export function useDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard,
    queryFn: gardenService.getDashboard,
  });
}

/**
 * useWateringStats — daily hydration summary + streak (today's counts, gardens
 * needing attention, current streak, this week's sessions).
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { wateringService } from '../services/watering.service';

export function useWateringStats() {
  return useQuery({
    queryKey: queryKeys.wateringStats,
    queryFn: wateringService.stats,
  });
}

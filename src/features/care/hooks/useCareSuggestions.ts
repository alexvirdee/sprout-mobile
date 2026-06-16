/**
 * useCareSuggestions — rules-based care suggestions for a plant (from the API).
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { careService } from '../services/care.service';

export function useCareSuggestions(plantId: string) {
  return useQuery({
    queryKey: queryKeys.careSuggestions(plantId),
    queryFn: () => careService.suggestions(plantId),
    enabled: !!plantId,
    staleTime: 5 * 60_000,
  });
}

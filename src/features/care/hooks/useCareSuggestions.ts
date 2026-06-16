/**
 * useCareSuggestions — rules-based care suggestions for a plant (from the API).
 */

import { useMutation, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { careService } from '../services/care.service';
import { AiCareSuggestionsResult } from '../types/care.types';

export function useCareSuggestions(plantId: string) {
  return useQuery({
    queryKey: queryKeys.careSuggestions(plantId),
    queryFn: () => careService.suggestions(plantId),
    enabled: !!plantId,
    staleTime: 5 * 60_000,
  });
}

/**
 * AI-refines a plant's care suggestions on demand (a metered call, so it's a
 * user-triggered mutation rather than an automatic query). Returns the refined
 * suggestions + aiUsed; never throws just because AI is unconfigured.
 */
export function useAiCareSuggestions(plantId: string) {
  return useMutation<AiCareSuggestionsResult, Error, void>({
    mutationFn: () => careService.aiSuggestions(plantId),
  });
}

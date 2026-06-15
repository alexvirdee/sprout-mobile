/**
 * useCitySearch — debounced city/place type-ahead over the Open-Meteo geocoding
 * service. Debounces the query, only searches at 2+ chars, and cancels stale
 * requests via React Query's AbortSignal. Shared across features.
 */

import { useQuery } from '@tanstack/react-query';

import { useDebouncedValue } from '@hooks/useDebouncedValue';
import { searchCities } from '@services/geocoding';

export function useCitySearch(query: string) {
  const debounced = useDebouncedValue(query.trim(), 300);

  return useQuery({
    queryKey: ['geocoding', debounced],
    queryFn: ({ signal }) => searchCities(debounced, signal),
    enabled: debounced.length >= 2,
    staleTime: 5 * 60_000,
    gcTime: 10 * 60_000,
    retry: 0,
  });
}

/**
 * useCurrentWeather — React Query wrapper over the Open-Meteo service. Disabled
 * until coordinates are available; weather is cached for 15 minutes.
 */

import { useQuery } from '@tanstack/react-query';

import { fetchCurrentWeather } from '../services/weather.service';
import { Coordinates } from '../types/weather.types';

export function useCurrentWeather(coords: Coordinates | null) {
  return useQuery({
    queryKey: ['weather', coords?.latitude ?? null, coords?.longitude ?? null],
    queryFn: () => fetchCurrentWeather(coords as Coordinates),
    enabled: !!coords,
    staleTime: 15 * 60_000,
    gcTime: 60 * 60_000,
    retry: 1,
  });
}

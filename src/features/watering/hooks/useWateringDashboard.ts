/**
 * useWateringDashboard — composes everything the Water tab needs: the user's
 * gardens + plants (for names/quick-water), watering stats, recent history,
 * device location + weather, and the create-watering mutation. Pull-to-refresh
 * refetches gardens, plants, stats, history (and weather).
 */

import { useGardens } from '@features/gardens/hooks/useGardens';
import { usePlants } from '@features/plants/hooks/usePlants';
import { useCurrentWeather } from '@features/weather/hooks/useCurrentWeather';
import { useDeviceLocation } from '@features/weather/hooks/useDeviceLocation';
import { useWatering } from './useWatering';
import { useWateringStats } from './useWateringStats';
import { useCreateWatering } from './useCreateWatering';

export function useWateringDashboard() {
  const { coords, status: locationStatus, request: requestLocation } = useDeviceLocation();
  const weather = useCurrentWeather(coords);
  const gardensQuery = useGardens();
  const plantsQuery = usePlants();
  const statsQuery = useWateringStats();
  const recentQuery = useWatering();
  const createWatering = useCreateWatering();

  const gardens = gardensQuery.data ?? [];
  const plants = plantsQuery.data ?? [];
  const logs = recentQuery.data ?? [];

  const refresh = () => {
    void gardensQuery.refetch();
    void plantsQuery.refetch();
    void statsQuery.refetch();
    void recentQuery.refetch();
    if (coords) void weather.refetch();
  };

  return {
    gardens,
    gardensQuery,
    plants,
    logs,
    recentQuery,
    stats: statsQuery.data,
    statsQuery,
    weather,
    locationStatus,
    requestLocation,
    createWatering,
    refresh,
    isRefreshing:
      gardensQuery.isRefetching ||
      plantsQuery.isRefetching ||
      statsQuery.isRefetching ||
      recentQuery.isRefetching,
  };
}

/**
 * useHomeDashboard — composes everything the Home screen needs: the user's real
 * gardens (React Query), device location + current weather, and derived rollups
 * / care suggestions / mood. Pull-to-refresh refetches gardens (and weather).
 */

import { useGardens } from '@features/gardens/hooks/useGardens';
import { useCurrentWeather } from '@features/weather/hooks/useCurrentWeather';
import { useDeviceLocation } from '@features/weather/hooks/useDeviceLocation';
import { buildCareSuggestions, gardenMood } from '../utils/homeRecommendations';

export function useHomeDashboard() {
  const { coords, status: locationStatus, request: requestLocation } = useDeviceLocation();
  const weather = useCurrentWeather(coords);
  const gardensQuery = useGardens();

  const gardens = gardensQuery.data ?? [];
  const totalGardens = gardens.length;
  const totalPlants = gardens.reduce((sum, g) => sum + (g.plantCount ?? 0), 0);
  const totalTasks = gardens.reduce((sum, g) => sum + (g.taskCount ?? 0), 0);

  const care = buildCareSuggestions({ gardenCount: totalGardens, totalPlants, weather: weather.data ?? null });
  const mood = gardenMood(gardens, weather.data ?? null);

  const refresh = () => {
    void gardensQuery.refetch();
    if (coords) void weather.refetch();
  };

  return {
    gardens,
    gardensQuery,
    weather,
    locationStatus,
    requestLocation,
    totalGardens,
    totalPlants,
    totalTasks,
    care,
    mood,
    refresh,
    isRefreshing: gardensQuery.isRefetching || weather.isRefetching,
  };
}

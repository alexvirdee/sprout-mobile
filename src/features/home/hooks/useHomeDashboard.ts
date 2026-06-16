/**
 * useHomeDashboard — composes everything Home needs from existing React Query
 * data (gardens, plants, recent waterings, weather) and derives the actionable
 * pieces: today's care, needs-attention, garden health, and recent activity.
 * No new endpoints — just intelligent composition. Pull-to-refresh refetches all.
 */

import { useGardens } from '@features/gardens/hooks/useGardens';
import { usePlants } from '@features/plants/hooks/usePlants';
import { useWatering } from '@features/watering/hooks/useWatering';
import { useWateringStats } from '@features/watering/hooks/useWateringStats';
import { useCurrentWeather } from '@features/weather/hooks/useCurrentWeather';
import { useDeviceLocation } from '@features/weather/hooks/useDeviceLocation';
import { daysSinceWatered } from '@features/watering/utils/hydrationStatus';
import { buildCareSuggestions, buildNeedsAttention } from '../utils/homeRecommendations';
import { computeGardenHealth } from '../utils/homeHealth';
import { buildRecentActivity } from '../utils/homeActivity';

export function useHomeDashboard() {
  const { coords, status: locationStatus, request: requestLocation } = useDeviceLocation();
  const weather = useCurrentWeather(coords);
  const gardensQuery = useGardens();
  const plantsQuery = usePlants();
  const recentQuery = useWatering();
  const statsQuery = useWateringStats();

  const gardens = gardensQuery.data ?? [];
  const plants = plantsQuery.data ?? [];
  const logs = recentQuery.data ?? [];
  const w = weather.data ?? null;

  const totalGardens = gardens.length;
  const totalPlants = plants.length;
  const totalWaterings = gardens.reduce((sum, g) => sum + (g.wateringCount ?? 0), 0);
  const hasGardens = totalGardens > 0;

  const gardensNeedingWater = gardens
    .filter((g) => {
      const d = daysSinceWatered(g.lastWateredAt);
      return d != null && d >= 3;
    })
    .map((g) => ({ id: g.id, name: g.name }));

  const care = buildCareSuggestions({
    gardenCount: totalGardens,
    totalPlants,
    totalWaterings,
    gardensNeedingWater,
    weather: w,
  });
  const attention = buildNeedsAttention(gardens, plants);
  const health = computeGardenHealth({ gardens, plants, weather: w, attentionCount: attention.length });

  const gardenNames = Object.fromEntries(gardens.map((g) => [g.id, g.name]));
  const plantNames = Object.fromEntries(plants.map((p) => [p.id, p.name]));
  const activity = buildRecentActivity({ gardens, plants, logs, gardenNames, plantNames });

  const refresh = () => {
    void gardensQuery.refetch();
    void plantsQuery.refetch();
    void recentQuery.refetch();
    void statsQuery.refetch();
    if (coords) void weather.refetch();
  };

  return {
    gardens,
    plants,
    hasGardens,
    totalGardens,
    totalPlants,
    weather,
    locationStatus,
    requestLocation,
    care,
    attention,
    health,
    activity,
    stats: statsQuery.data,
    gardensQuery,
    refresh,
    isRefreshing:
      gardensQuery.isRefetching ||
      plantsQuery.isRefetching ||
      recentQuery.isRefetching ||
      statsQuery.isRefetching ||
      weather.isRefetching,
  };
}

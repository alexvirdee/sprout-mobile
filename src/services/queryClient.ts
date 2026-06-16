/**
 * Shared React Query client. Defaults tuned for a mobile app: a short stale
 * window, no aggressive refetch-on-focus thrash, and one retry.
 */

import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      gcTime: 5 * 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export const queryKeys = {
  dashboard: ['dashboard'] as const,
  gardens: ['gardens'] as const,
  garden: (id: string) => ['gardens', id] as const,
  plants: ['plants'] as const,
  plant: (id: string) => ['plant', id] as const,
  watering: ['watering'] as const,
  wateringStats: ['watering', 'stats'] as const,
  profileStats: ['profile', 'stats'] as const,
  profileAchievements: ['profile', 'achievements'] as const,
  careTasks: ['care-tasks'] as const,
  careTask: (id: string) => ['care-tasks', id] as const,
  careSuggestions: (plantId: string) => ['care-suggestions', plantId] as const,
  tasks: ['tasks'] as const,
};

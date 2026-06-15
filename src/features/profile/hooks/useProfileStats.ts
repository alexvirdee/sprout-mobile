/**
 * useProfileStats — real gardening stats (gardens, plants, waterings, harvests,
 * tasks, streaks). Disabled in demo mode (no token). Refetches on mount so the
 * profile reflects activity from elsewhere in the app.
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { useAuthStore } from '@store/authStore';
import { profileService } from '../services/profile.service';

export function useProfileStats() {
  const isDemo = useAuthStore((s) => s.isDemo);
  return useQuery({
    queryKey: queryKeys.profileStats,
    queryFn: profileService.getStats,
    enabled: !isDemo,
    staleTime: 0,
  });
}

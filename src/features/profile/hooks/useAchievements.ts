/**
 * useAchievements — the user's achievements with live unlock status. Disabled in
 * demo mode (no token). Refetches on mount to catch newly unlocked milestones.
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { useAuthStore } from '@store/authStore';
import { profileService } from '../services/profile.service';

export function useAchievements() {
  const isDemo = useAuthStore((s) => s.isDemo);
  return useQuery({
    queryKey: queryKeys.profileAchievements,
    queryFn: profileService.getAchievements,
    enabled: !isDemo,
    staleTime: 0,
  });
}

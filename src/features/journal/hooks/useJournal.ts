/**
 * useJournal — the journal timeline for a garden (or plant), newest first.
 */

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { useAuthStore } from '@store/authStore';
import { journalService } from '../services/journal.service';
import { JournalListParams } from '../types/journal.types';

export function useJournal(params?: JournalListParams) {
  const isDemo = useAuthStore((s) => s.isDemo);
  return useQuery({
    queryKey: queryKeys.journalList(params),
    queryFn: () => journalService.list(params),
    enabled: !isDemo,
    staleTime: 60_000,
  });
}

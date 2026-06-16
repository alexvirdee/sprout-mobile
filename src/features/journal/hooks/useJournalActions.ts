/**
 * Journal mutations — create, update, delete, and photo upload. All invalidate
 * the journal cache; since harvests feed gardening stats + achievements (and
 * Home's activity), those caches are refreshed too.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { journalService } from '../services/journal.service';
import { JournalEntry, JournalEntryPayload } from '../types/journal.types';

function useInvalidateJournal() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: queryKeys.journal });
    // Harvests change gardening stats, achievements, and Home's recent activity.
    void qc.invalidateQueries({ queryKey: queryKeys.profileStats });
    void qc.invalidateQueries({ queryKey: queryKeys.profileAchievements });
    void qc.invalidateQueries({ queryKey: queryKeys.dashboard });
  };
}

export function useCreateJournalEntry() {
  const invalidate = useInvalidateJournal();
  return useMutation<JournalEntry, Error, JournalEntryPayload>({
    mutationFn: (payload) => journalService.create(payload),
    onSuccess: invalidate,
  });
}

export function useUpdateJournalEntry() {
  const invalidate = useInvalidateJournal();
  return useMutation<JournalEntry, Error, { id: string; payload: Partial<JournalEntryPayload> }>({
    mutationFn: ({ id, payload }) => journalService.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteJournalEntry() {
  const invalidate = useInvalidateJournal();
  return useMutation<{ ok: true }, Error, string>({
    mutationFn: (id) => journalService.remove(id),
    onSuccess: invalidate,
  });
}

export function useUploadJournalPhoto() {
  const invalidate = useInvalidateJournal();
  return useMutation<JournalEntry, Error, { id: string; uri: string }>({
    mutationFn: ({ id, uri }) => journalService.uploadPhoto(id, uri),
    onSuccess: invalidate,
  });
}

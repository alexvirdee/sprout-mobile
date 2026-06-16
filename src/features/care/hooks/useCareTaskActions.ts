/**
 * Care task mutations — create, complete, skip, reschedule, edit, delete, and
 * enabling suggestions. All invalidate the care-tasks cache (prefix-matches the
 * lists + single-task queries) so Home/Garden/Plant care views refresh.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { careService } from '../services/care.service';
import { CareTask, CareTaskPayload } from '../types/care.types';

function useInvalidateCare() {
  const qc = useQueryClient();
  return () => {
    void qc.invalidateQueries({ queryKey: queryKeys.careTasks });
  };
}

export function useCreateCareTask() {
  const invalidate = useInvalidateCare();
  return useMutation<CareTask, Error, CareTaskPayload>({
    mutationFn: (payload) => careService.create(payload),
    onSuccess: invalidate,
  });
}

export function useCompleteCareTask() {
  const invalidate = useInvalidateCare();
  return useMutation<{ task: CareTask; next: CareTask | null }, Error, string>({
    mutationFn: (id) => careService.complete(id),
    onSuccess: invalidate,
  });
}

export function useSkipCareTask() {
  const invalidate = useInvalidateCare();
  return useMutation<{ task: CareTask; next: CareTask | null }, Error, string>({
    mutationFn: (id) => careService.skip(id),
    onSuccess: invalidate,
  });
}

export function useRescheduleCareTask() {
  const invalidate = useInvalidateCare();
  return useMutation<CareTask, Error, { id: string; dueDate: string }>({
    mutationFn: ({ id, dueDate }) => careService.reschedule(id, dueDate),
    onSuccess: invalidate,
  });
}

export function useUpdateCareTask() {
  const invalidate = useInvalidateCare();
  return useMutation<CareTask, Error, { id: string; payload: Partial<CareTaskPayload> }>({
    mutationFn: ({ id, payload }) => careService.update(id, payload),
    onSuccess: invalidate,
  });
}

export function useDeleteCareTask() {
  const invalidate = useInvalidateCare();
  return useMutation<{ ok: true }, Error, string>({
    mutationFn: (id) => careService.remove(id),
    onSuccess: invalidate,
  });
}

export function useEnableCareSuggestions(plantId: string) {
  const invalidate = useInvalidateCare();
  return useMutation<CareTask[], Error, string[]>({
    mutationFn: (keys) => careService.enableSuggestions(plantId, keys),
    onSuccess: invalidate,
  });
}

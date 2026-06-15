/**
 * useCreateWatering — log a watering with an optimistic update so the UI feels
 * instant: the garden (and plant) immediately show "watered just now", then the
 * real data + stats + history are invalidated on settle.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@services/queryClient';
import { wateringService } from '../services/watering.service';
import { WateringLog, WateringPayload } from '../types/watering.types';
import { Garden } from '@features/gardens/types/garden.types';
import { Plant } from '@features/plants/types/plant.types';

interface Ctx {
  prevGardens?: Garden[];
  prevGarden?: Garden;
}

export function useCreateWatering() {
  const qc = useQueryClient();

  return useMutation<WateringLog, Error, WateringPayload, Ctx>({
    mutationFn: (payload) => wateringService.create(payload),

    onMutate: async (payload) => {
      const nowISO = new Date().toISOString();
      await qc.cancelQueries({ queryKey: queryKeys.gardens });

      const prevGardens = qc.getQueryData<Garden[]>(queryKeys.gardens);
      qc.setQueryData<Garden[]>(queryKeys.gardens, (prev) =>
        prev?.map((g) =>
          g.id === payload.gardenId
            ? { ...g, lastWateredAt: nowISO, wateringCount: (g.wateringCount ?? 0) + 1 }
            : g
        )
      );

      const prevGarden = qc.getQueryData<Garden>(queryKeys.garden(payload.gardenId));
      if (prevGarden) {
        qc.setQueryData<Garden>(queryKeys.garden(payload.gardenId), {
          ...prevGarden,
          lastWateredAt: nowISO,
          wateringCount: (prevGarden.wateringCount ?? 0) + 1,
        });
      }

      if (payload.plantId) {
        qc.setQueriesData<Plant[]>({ queryKey: ['plants'] }, (prev) =>
          prev?.map((p) =>
            p.id === payload.plantId
              ? { ...p, lastWateredAt: nowISO, wateringCount: (p.wateringCount ?? 0) + 1 }
              : p
          )
        );
      }

      return { prevGardens, prevGarden };
    },

    onError: (_err, payload, ctx) => {
      if (ctx?.prevGardens) qc.setQueryData(queryKeys.gardens, ctx.prevGardens);
      if (ctx?.prevGarden) qc.setQueryData(queryKeys.garden(payload.gardenId), ctx.prevGarden);
    },

    onSettled: (_data, _err, payload) => {
      void qc.invalidateQueries({ queryKey: ['watering'] });
      void qc.invalidateQueries({ queryKey: queryKeys.gardens });
      void qc.invalidateQueries({ queryKey: queryKeys.garden(payload.gardenId) });
      void qc.invalidateQueries({ queryKey: ['plants'] });
      if (payload.plantId) void qc.invalidateQueries({ queryKey: queryKeys.plant(payload.plantId) });
    },
  });
}

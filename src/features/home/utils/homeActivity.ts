/**
 * homeActivity — compose a lightweight, recent activity feed from existing data
 * (waterings, plants added, gardens created). No new API calls. Each item knows
 * what to open on tap; recently-logged waterings are marked undoable.
 */

import type { Garden } from '@features/gardens/types/garden.types';
import type { Plant } from '@features/plants/types/plant.types';
import type { WateringLog } from '@features/watering/types/watering.types';

/** A just-logged watering can be undone within this window. */
const UNDO_WINDOW_MS = 30 * 60 * 1000;

export interface ActivityTarget {
  kind: 'garden' | 'plant';
  id: string;
}

export interface ActivityItem {
  id: string;
  emoji: string;
  text: string;
  at: string;
  target: ActivityTarget;
  wateringId?: string;
  undoable?: boolean;
}

export interface ActivityInput {
  gardens: Garden[];
  plants: Plant[];
  logs: WateringLog[];
  gardenNames: Record<string, string>;
  plantNames: Record<string, string>;
}

export function buildRecentActivity({ gardens, plants, logs, gardenNames, plantNames }: ActivityInput): ActivityItem[] {
  const items: ActivityItem[] = [];
  const now = Date.now();

  for (const l of logs) {
    const what = l.plantId ? plantNames[l.plantId] ?? 'a plant' : gardenNames[l.gardenId] ?? 'a garden';
    items.push({
      id: `w-${l.id}`,
      emoji: '💧',
      text: `Watered ${what}`,
      at: l.createdAt,
      target: l.plantId ? { kind: 'plant', id: l.plantId } : { kind: 'garden', id: l.gardenId },
      wateringId: l.id,
      undoable: now - new Date(l.createdAt).getTime() < UNDO_WINDOW_MS,
    });
  }
  for (const p of plants) {
    items.push({ id: `p-${p.id}`, emoji: '🌱', text: `Added ${p.name}`, at: p.createdAt, target: { kind: 'plant', id: p.id } });
  }
  for (const g of gardens) {
    items.push({ id: `g-${g.id}`, emoji: '🪴', text: `Created ${g.name}`, at: g.createdAt, target: { kind: 'garden', id: g.id } });
  }

  return items
    .filter((i) => !Number.isNaN(new Date(i.at).getTime()))
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 6);
}

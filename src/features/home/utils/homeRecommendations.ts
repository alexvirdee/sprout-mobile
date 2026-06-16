/**
 * homeRecommendations — rules-based "what should I do next?" logic for Home:
 * actionable care suggestions + a "needs attention" list, derived from gardens,
 * plants, and weather. Pure, ordered by priority, and unit-testable. Not a task
 * engine — just calm guidance.
 */

import type { BadgeTone } from '@components/index';
import type { CurrentWeather } from '@features/weather/types/weather.types';
import type { Garden } from '@features/gardens/types/garden.types';
import type { Plant } from '@features/plants/types/plant.types';
import { HOT_THRESHOLD, RAIN_THRESHOLD, WIND_THRESHOLD } from '@features/weather/utils/weatherRecommendations';
import { daysSinceWatered, lastWateredLabel } from '@features/watering/utils/hydrationStatus';

/** What an action button on a care item should do. The screen maps these to nav. */
export type CareAction = 'create-garden' | 'add-plant' | 'water' | 'scan' | 'review';

export interface CareItem {
  id: string;
  emoji: string;
  title: string;
  detail: string;
  actionLabel: string;
  action: CareAction;
  gardenId?: string;
}

export interface CareInput {
  gardenCount: number;
  totalPlants: number;
  totalWaterings: number;
  gardensNeedingWater: { id: string; name: string }[];
  weather: CurrentWeather | null;
}

export function buildCareSuggestions({
  gardenCount,
  totalPlants,
  totalWaterings,
  gardensNeedingWater,
  weather,
}: CareInput): CareItem[] {
  if (gardenCount === 0) {
    return [
      {
        id: 'create',
        emoji: '🌱',
        title: 'Create your first garden',
        detail: 'Set up a growing space and Sprout’s tips become personal.',
        actionLabel: 'Create',
        action: 'create-garden',
      },
    ];
  }

  const items: CareItem[] = [];

  if (totalPlants === 0) {
    items.push({
      id: 'add-plant',
      emoji: '🪴',
      title: 'Add your first plant',
      detail: 'Tell Sprout what you’re growing for more useful care.',
      actionLabel: 'Add Plant',
      action: 'add-plant',
    });
  }

  for (const g of gardensNeedingWater.slice(0, 2)) {
    items.push({
      id: `water-${g.id}`,
      emoji: '💧',
      title: `Water ${g.name}`,
      detail: 'It hasn’t had a drink in a few days.',
      actionLabel: 'Water',
      action: 'water',
      gardenId: g.id,
    });
  }

  if (weather) {
    if (weather.precipitationProbability >= RAIN_THRESHOLD) {
      items.push({
        id: 'rain',
        emoji: '🌧️',
        title: 'Rain likely later today',
        detail: 'Check the soil before watering — it may not need it.',
        actionLabel: 'Open Water',
        action: 'water',
      });
    } else if (weather.high >= HOT_THRESHOLD) {
      items.push({
        id: 'hot',
        emoji: '🔥',
        title: 'Hot afternoon ahead',
        detail: 'Water early and check containers in the heat.',
        actionLabel: 'Water',
        action: 'water',
      });
    } else if (weather.windSpeed >= WIND_THRESHOLD) {
      items.push({
        id: 'wind',
        emoji: '🌬️',
        title: 'Windy conditions',
        detail: 'Shelter young seedlings from the wind today.',
        actionLabel: 'Open Garden',
        action: 'review',
      });
    }
  }

  if (totalPlants > 0 && totalWaterings === 0) {
    items.push({
      id: 'start-water',
      emoji: '💧',
      title: 'Start watering tracking',
      detail: 'Log your first watering to build a healthy streak.',
      actionLabel: 'Water',
      action: 'water',
    });
  }

  items.push({
    id: 'scan',
    emoji: '📸',
    title: 'Identify a plant',
    detail: 'Snap a photo and Sprout will help identify it.',
    actionLabel: 'Scan',
    action: 'scan',
  });

  return items.slice(0, 4);
}

export interface AttentionItem {
  id: string;
  kind: 'garden' | 'plant';
  emoji: string;
  title: string;
  detail: string;
  tone: BadgeTone;
  gardenId: string;
}

/** Gardens not watered in a while + plants flagged / overdue. Empty = all healthy. */
export function buildNeedsAttention(gardens: Garden[], plants: Plant[]): AttentionItem[] {
  const items: AttentionItem[] = [];

  for (const g of gardens) {
    const days = daysSinceWatered(g.lastWateredAt);
    if (days != null && days >= 3) {
      items.push({
        id: `g-${g.id}`,
        kind: 'garden',
        emoji: '💧',
        title: g.name,
        detail: lastWateredLabel(g.lastWateredAt),
        tone: days >= 5 ? 'warning' : 'gold',
        gardenId: g.id,
      });
    }
  }

  for (const p of plants) {
    if (p.status === 'needs_attention') {
      items.push({ id: `p-${p.id}`, kind: 'plant', emoji: '🌿', title: p.name, detail: 'Needs attention', tone: 'gold', gardenId: p.gardenId });
      continue;
    }
    const days = daysSinceWatered(p.lastWateredAt);
    if (days != null && days >= 5) {
      items.push({ id: `p-${p.id}`, kind: 'plant', emoji: '🌿', title: p.name, detail: 'Watering overdue', tone: 'warning', gardenId: p.gardenId });
    }
  }

  return items.slice(0, 5);
}

/** A short "garden mood" label (kept for badges / summaries). */
export function gardenMood(gardens: Pick<Garden, 'healthStatus'>[], weather: CurrentWeather | null): string {
  if (gardens.length === 0) return 'Getting started';
  if (weather && weather.precipitationProbability >= RAIN_THRESHOLD) return 'Rain helped today';
  if (weather && weather.high >= HOT_THRESHOLD) return 'Sunny & thirsty';
  if (gardens.some((g) => /attention/i.test(g.healthStatus))) return 'Needs attention';
  return 'Calm & growing';
}

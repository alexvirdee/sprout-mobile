/**
 * homeHealth — a simple, friendly "garden health" score (0–100) + contributing
 * factors, from watering recency, active plants, weather, and items needing
 * attention. Deliberately lightweight; meant as a reassuring overview.
 */

import type { CurrentWeather } from '@features/weather/types/weather.types';
import type { Garden } from '@features/gardens/types/garden.types';
import type { Plant } from '@features/plants/types/plant.types';
import { HOT_THRESHOLD, RAIN_THRESHOLD } from '@features/weather/utils/weatherRecommendations';
import { daysSinceWatered } from '@features/watering/utils/hydrationStatus';

export type HealthTone = 'green' | 'sage' | 'gold';

export interface HealthFactor {
  emoji: string;
  text: string;
  good: boolean;
}

export interface GardenHealth {
  score: number;
  label: string;
  tone: HealthTone;
  factors: HealthFactor[];
}

export interface HealthInput {
  gardens: Garden[];
  plants: Plant[];
  weather: CurrentWeather | null;
  attentionCount: number;
}

export function computeGardenHealth({ gardens, plants, weather, attentionCount }: HealthInput): GardenHealth {
  const staleGardens = gardens.filter((g) => {
    const d = daysSinceWatered(g.lastWateredAt);
    return d != null && d >= 4;
  }).length;
  const wateredRecently = gardens.filter((g) => {
    const d = daysSinceWatered(g.lastWateredAt);
    return d != null && d <= 2;
  }).length;

  let score = 100 - staleGardens * 12 - attentionCount * 6;
  if (weather && weather.high >= HOT_THRESHOLD) score -= 4;
  score = Math.max(0, Math.min(100, Math.round(score)));

  const activePlants = plants.length;

  const weatherFactor: HealthFactor = weather
    ? weather.precipitationProbability >= RAIN_THRESHOLD
      ? { emoji: '🌧️', text: 'Rain expected today', good: true }
      : weather.high >= HOT_THRESHOLD
        ? { emoji: '🔥', text: 'Hot weather — water early', good: false }
        : { emoji: weather.emoji, text: `${weather.label}, ${weather.high}°`, good: true }
    : { emoji: '🌤️', text: 'Enable weather for local tips', good: true };

  const factors: HealthFactor[] = [
    {
      emoji: '💧',
      text: wateredRecently > 0 ? 'Watered recently' : 'Water soon to keep things happy',
      good: wateredRecently > 0,
    },
    { emoji: '🌿', text: `${activePlants} ${activePlants === 1 ? 'plant' : 'plants'} growing`, good: activePlants > 0 },
    weatherFactor,
    {
      emoji: attentionCount === 0 ? '✅' : '⚠️',
      text: attentionCount === 0 ? 'No urgent tasks' : `${attentionCount} ${attentionCount === 1 ? 'item needs' : 'items need'} attention`,
      good: attentionCount === 0,
    },
  ];

  const label = score >= 85 ? 'Healthy' : score >= 60 ? 'Doing well' : 'Needs care';
  const tone: HealthTone = score >= 85 ? 'green' : score >= 60 ? 'sage' : 'gold';

  return { score, label, tone, factors };
}

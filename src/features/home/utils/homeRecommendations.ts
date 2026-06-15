/**
 * homeRecommendations — rules-based "Today's care" suggestions and a "garden
 * mood" label, derived from the user's gardens + current weather. Pure and
 * ordered by priority so it's easy to read and unit-test. (Not a task engine.)
 */

import type { CurrentWeather } from '@features/weather/types/weather.types';
import type { Garden } from '@features/gardens/types/garden.types';
import { HOT_THRESHOLD, RAIN_THRESHOLD, WIND_THRESHOLD } from '@features/weather/utils/weatherRecommendations';

export interface CareItem {
  id: string;
  emoji: string;
  text: string;
}

export interface CareInput {
  gardenCount: number;
  totalPlants: number;
  weather: CurrentWeather | null;
}

export function buildCareSuggestions({ gardenCount, totalPlants, weather }: CareInput): CareItem[] {
  if (gardenCount === 0) {
    return [{ id: 'create', emoji: '🌱', text: 'Create a garden to start tracking your growing space.' }];
  }

  const items: CareItem[] = [];

  if (totalPlants === 0) {
    items.push({ id: 'add-plant', emoji: '🪴', text: 'Add your first plant to make care tips more useful.' });
  }

  if (weather) {
    if (weather.precipitationProbability >= RAIN_THRESHOLD) {
      items.push({ id: 'rain', emoji: '☔️', text: 'Skip watering if the rain arrives today.' });
    } else if (weather.high >= HOT_THRESHOLD) {
      items.push({ id: 'hot', emoji: '🔥', text: 'Check thirsty containers and herbs in the heat.' });
    } else if (weather.windSpeed >= WIND_THRESHOLD) {
      items.push({ id: 'wind', emoji: '🌬️', text: 'Shelter young seedlings from the wind.' });
    }
  }

  items.push({ id: 'review', emoji: '📝', text: 'Review your gardens and note anything new today.' });

  return items.slice(0, 3);
}

/** A short "garden mood" label for the overview badge. */
export function gardenMood(gardens: Pick<Garden, 'healthStatus'>[], weather: CurrentWeather | null): string {
  if (gardens.length === 0) return 'Getting started';
  if (weather && weather.precipitationProbability >= RAIN_THRESHOLD) return 'Rain helped today';
  if (weather && weather.high >= HOT_THRESHOLD) return 'Sunny & thirsty';
  if (gardens.some((g) => /attention/i.test(g.healthStatus))) return 'Needs attention';
  return 'Calm & growing';
}

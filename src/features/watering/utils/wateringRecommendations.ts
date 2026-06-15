/**
 * wateringRecommendations — weather-aware watering guidance. Enhances watering
 * but never blocks it. Pure + unit-testable.
 */

import type { CurrentWeather } from '@features/weather/types/weather.types';
import { HOT_THRESHOLD, RAIN_THRESHOLD } from '@features/weather/utils/weatherRecommendations';

const COOL_THRESHOLD = 60; // °F daily high

export interface WateringTip {
  emoji: string;
  text: string;
}

export function wateringRecommendation(weather: CurrentWeather | null): WateringTip {
  if (!weather) {
    return { emoji: '💧', text: 'Check the soil before watering — water if the top inch is dry.' };
  }
  if (weather.precipitationProbability >= RAIN_THRESHOLD) {
    return { emoji: '🌧️', text: 'Rain expected later today. Check soil before watering.' };
  }
  if (weather.high >= HOT_THRESHOLD) {
    return { emoji: '🥵', text: 'Hot afternoon ahead. Water early if possible.' };
  }
  if (weather.high <= COOL_THRESHOLD) {
    return { emoji: '🍃', text: 'Cool day. Your garden may need less water.' };
  }
  return { emoji: '🌤️', text: 'A balanced day — water as your soil needs.' };
}

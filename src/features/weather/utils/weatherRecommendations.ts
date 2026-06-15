/**
 * Rules-based gardening recommendation from the current weather. Pure + ordered
 * by priority (rain → heat → wind → mild → no-weather fallback) so it's easy to
 * read and unit-test.
 */

import type { CurrentWeather } from '../types/weather.types';

export const RAIN_THRESHOLD = 60; // % precipitation probability
export const HOT_THRESHOLD = 90; // °F daily high
export const WIND_THRESHOLD = 20; // mph

export interface WeatherTip {
  emoji: string;
  text: string;
}

export function weatherRecommendation(weather: CurrentWeather | null): WeatherTip {
  if (!weather) {
    return { emoji: '📍', text: 'Add weather access for smarter garden care.' };
  }
  if (weather.precipitationProbability >= RAIN_THRESHOLD) {
    return { emoji: '🌧️', text: 'Rain may help today — check soil before watering.' };
  }
  if (weather.high >= HOT_THRESHOLD) {
    return { emoji: '🥵', text: 'Hot day ahead — water early and check containers.' };
  }
  if (weather.windSpeed >= WIND_THRESHOLD) {
    return { emoji: '🌬️', text: 'Windy today — protect seedlings and fresh transplants.' };
  }
  return { emoji: '🌱', text: 'Nice garden day — a good time to check growth.' };
}

/** A short "garden mood" label for the weather, used by the WeatherCard badge. */
export function weatherMood(weather: CurrentWeather | null): string {
  if (!weather) return 'Weather off';
  if (weather.precipitationProbability >= RAIN_THRESHOLD) return 'Rain may help';
  if (weather.high >= HOT_THRESHOLD) return 'Sunny & thirsty';
  if (weather.windSpeed >= WIND_THRESHOLD) return 'Breezy';
  return 'Calm & growing';
}

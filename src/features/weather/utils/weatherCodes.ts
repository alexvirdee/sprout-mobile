/**
 * Map WMO weather codes (Open-Meteo) to a friendly condition, label, and emoji.
 * https://open-meteo.com/en/docs (Weather variable documentation → WMO codes)
 */

import type { WeatherCondition } from '../types/weather.types';

export interface WeatherDescriptor {
  condition: WeatherCondition;
  label: string;
  emoji: string;
}

export function describeWeather(code: number, isDay = true): WeatherDescriptor {
  if (code === 0) return { condition: 'clear', label: isDay ? 'Clear & sunny' : 'Clear night', emoji: isDay ? '☀️' : '🌙' };
  if (code === 1 || code === 2) return { condition: 'cloudy', label: 'Partly cloudy', emoji: isDay ? '⛅' : '☁️' };
  if (code === 3) return { condition: 'cloudy', label: 'Overcast', emoji: '☁️' };
  if (code === 45 || code === 48) return { condition: 'fog', label: 'Foggy', emoji: '🌫️' };
  if (code >= 51 && code <= 57) return { condition: 'drizzle', label: 'Drizzle', emoji: '🌦️' };
  if (code >= 61 && code <= 67) return { condition: 'rain', label: 'Rainy', emoji: '🌧️' };
  if (code >= 71 && code <= 77) return { condition: 'snow', label: 'Snow', emoji: '❄️' };
  if (code >= 80 && code <= 82) return { condition: 'rain', label: 'Rain showers', emoji: '🌧️' };
  if (code >= 85 && code <= 86) return { condition: 'snow', label: 'Snow showers', emoji: '🌨️' };
  if (code >= 95) return { condition: 'thunder', label: 'Thunderstorm', emoji: '⛈️' };
  return { condition: 'cloudy', label: 'Mild', emoji: '🌤️' };
}

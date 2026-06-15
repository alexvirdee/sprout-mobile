/**
 * weather.service — Open-Meteo current + daily forecast. No API key required, so
 * it's called directly from the app (v1). Returns a normalized CurrentWeather.
 */

import { Coordinates, CurrentWeather } from '../types/weather.types';
import { describeWeather } from '../utils/weatherCodes';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchCurrentWeather({ latitude, longitude }: Coordinates): Promise<CurrentWeather> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    current: 'temperature_2m,apparent_temperature,weather_code,wind_speed_10m,is_day',
    daily: 'temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    temperature_unit: 'fahrenheit',
    wind_speed_unit: 'mph',
    precipitation_unit: 'inch',
    timezone: 'auto',
    forecast_days: '1',
  });

  const res = await fetch(`${BASE_URL}?${params.toString()}`);
  if (!res.ok) throw new Error(`Weather request failed (${res.status})`);

  const data = (await res.json()) as {
    current: {
      temperature_2m: number;
      apparent_temperature: number;
      weather_code: number;
      wind_speed_10m: number;
      is_day: number;
    };
    daily: {
      temperature_2m_max: number[];
      temperature_2m_min: number[];
      precipitation_probability_max: (number | null)[];
    };
  };

  const c = data.current;
  const d = data.daily;
  const isDay = c.is_day === 1;
  const desc = describeWeather(c.weather_code, isDay);

  return {
    temperature: Math.round(c.temperature_2m),
    apparentTemperature: Math.round(c.apparent_temperature),
    weatherCode: c.weather_code,
    condition: desc.condition,
    label: desc.label,
    emoji: desc.emoji,
    windSpeed: Math.round(c.wind_speed_10m),
    isDay,
    high: Math.round(d.temperature_2m_max[0]),
    low: Math.round(d.temperature_2m_min[0]),
    precipitationProbability: d.precipitation_probability_max?.[0] ?? 0,
    unit: 'F',
  };
}

/**
 * Weather domain types. Powered by Open-Meteo (no API key required), called
 * directly from the app for v1.
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export type WeatherCondition =
  | 'clear'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'thunder';

export interface CurrentWeather {
  /** Rounded current temperature, in the requested unit. */
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  condition: WeatherCondition;
  label: string;
  emoji: string;
  /** Wind speed (mph). */
  windSpeed: number;
  isDay: boolean;
  /** Daily high / low. */
  high: number;
  low: number;
  /** Daily max precipitation probability (%). */
  precipitationProbability: number;
  unit: 'F' | 'C';
}

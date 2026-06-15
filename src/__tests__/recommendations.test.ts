/**
 * Recommendation logic — the rules behind the Home weather tip + "today's care"
 * suggestions. Pure functions, tested directly.
 */

import { weatherRecommendation } from '@features/weather/utils/weatherRecommendations';
import { buildCareSuggestions } from '@features/home/utils/homeRecommendations';
import type { CurrentWeather } from '@features/weather/types/weather.types';

function makeWeather(p: Partial<CurrentWeather> = {}): CurrentWeather {
  return {
    temperature: 72,
    apparentTemperature: 72,
    weatherCode: 0,
    condition: 'clear',
    label: 'Clear',
    emoji: '☀️',
    windSpeed: 5,
    isDay: true,
    high: 75,
    low: 55,
    precipitationProbability: 10,
    unit: 'F',
    ...p,
  };
}

describe('weatherRecommendation', () => {
  it('flags likely rain (>= 60%)', () => {
    expect(weatherRecommendation(makeWeather({ precipitationProbability: 70 })).text).toMatch(/rain/i);
  });
  it('flags a hot day (high >= 90)', () => {
    expect(weatherRecommendation(makeWeather({ high: 95, precipitationProbability: 0 })).text).toMatch(/hot/i);
  });
  it('flags wind (>= 20 mph)', () => {
    expect(weatherRecommendation(makeWeather({ windSpeed: 25, high: 70, precipitationProbability: 0 })).text).toMatch(/wind/i);
  });
  it('gives a calm message on a mild day', () => {
    expect(weatherRecommendation(makeWeather()).text).toMatch(/nice garden day/i);
  });
  it('falls back when there is no weather', () => {
    expect(weatherRecommendation(null).text).toMatch(/weather access/i);
  });
  it('prioritizes rain over heat', () => {
    expect(weatherRecommendation(makeWeather({ precipitationProbability: 80, high: 95 })).text).toMatch(/rain/i);
  });
});

describe('buildCareSuggestions', () => {
  it('prompts to create a garden when there are none', () => {
    const items = buildCareSuggestions({ gardenCount: 0, totalPlants: 0, weather: null });
    expect(items).toHaveLength(1);
    expect(items[0].text).toMatch(/create a garden/i);
  });
  it('suggests adding a plant when a garden has none', () => {
    const items = buildCareSuggestions({ gardenCount: 1, totalPlants: 0, weather: makeWeather() });
    expect(items.some((i) => /first plant/i.test(i.text))).toBe(true);
  });
  it('suggests skipping watering when rain is likely', () => {
    const items = buildCareSuggestions({ gardenCount: 1, totalPlants: 3, weather: makeWeather({ precipitationProbability: 80 }) });
    expect(items.some((i) => /skip watering/i.test(i.text))).toBe(true);
  });
  it('suggests checking thirsty plants on a hot day', () => {
    const items = buildCareSuggestions({ gardenCount: 1, totalPlants: 3, weather: makeWeather({ high: 95, precipitationProbability: 0 }) });
    expect(items.some((i) => /thirsty/i.test(i.text))).toBe(true);
  });
  it('always includes a review suggestion when gardens exist', () => {
    const items = buildCareSuggestions({ gardenCount: 2, totalPlants: 5, weather: makeWeather() });
    expect(items.some((i) => /review your gardens/i.test(i.text))).toBe(true);
  });
  it('does not nag about plants when plants already exist', () => {
    const items = buildCareSuggestions({ gardenCount: 1, totalPlants: 4, weather: makeWeather() });
    expect(items.some((i) => /first plant/i.test(i.text))).toBe(false);
  });
});

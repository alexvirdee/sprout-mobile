/**
 * Watering logic — hydration status (days-since rules) and the weather-aware
 * watering recommendation. Pure functions, tested directly.
 */

import {
  daysSinceWatered,
  hydrationStatus,
  lastWateredLabel,
} from '@features/watering/utils/hydrationStatus';
import { wateringRecommendation } from '@features/watering/utils/wateringRecommendations';
import type { CurrentWeather } from '@features/weather/types/weather.types';

/** n whole days ago, anchored at noon to avoid midnight-boundary flakiness. */
function daysAgoISO(n: number): string {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

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

describe('daysSinceWatered', () => {
  it('returns null when never watered', () => {
    expect(daysSinceWatered(null)).toBeNull();
    expect(daysSinceWatered(undefined)).toBeNull();
  });
  it('counts calendar days', () => {
    expect(daysSinceWatered(daysAgoISO(0))).toBe(0);
    expect(daysSinceWatered(daysAgoISO(3))).toBe(3);
  });
});

describe('hydrationStatus', () => {
  it('is "Not watered yet" when never watered', () => {
    expect(hydrationStatus(null).level).toBe('unknown');
    expect(hydrationStatus(null).label).toMatch(/not watered/i);
  });
  it('is Healthy when watered today', () => {
    expect(hydrationStatus(daysAgoISO(0)).level).toBe('healthy');
  });
  it('is Doing well at 1–2 days', () => {
    expect(hydrationStatus(daysAgoISO(1)).level).toBe('doing_well');
    expect(hydrationStatus(daysAgoISO(2)).level).toBe('doing_well');
  });
  it('is Check soon at 3–4 days', () => {
    expect(hydrationStatus(daysAgoISO(3)).level).toBe('check_soon');
    expect(hydrationStatus(daysAgoISO(4)).level).toBe('check_soon');
  });
  it('is Needs attention at 5+ days', () => {
    expect(hydrationStatus(daysAgoISO(5)).level).toBe('needs_attention');
    expect(hydrationStatus(daysAgoISO(9)).level).toBe('needs_attention');
  });
});

describe('lastWateredLabel', () => {
  it('reads naturally', () => {
    expect(lastWateredLabel(null)).toMatch(/never/i);
    expect(lastWateredLabel(daysAgoISO(0))).toMatch(/today/i);
    expect(lastWateredLabel(daysAgoISO(1))).toMatch(/yesterday/i);
    expect(lastWateredLabel(daysAgoISO(3))).toMatch(/3 days ago/i);
  });
});

describe('wateringRecommendation', () => {
  it('falls back to a soil check when there is no weather', () => {
    expect(wateringRecommendation(null).text).toMatch(/soil/i);
  });
  it('flags likely rain (>= 60%)', () => {
    expect(wateringRecommendation(makeWeather({ precipitationProbability: 70 })).text).toMatch(/rain/i);
  });
  it('flags a hot day (high >= 90)', () => {
    expect(wateringRecommendation(makeWeather({ high: 95, precipitationProbability: 0 })).text).toMatch(/hot/i);
  });
  it('eases off on a cool day (high <= 60)', () => {
    expect(wateringRecommendation(makeWeather({ high: 55, precipitationProbability: 0 })).text).toMatch(/less water/i);
  });
  it('gives a balanced message on a mild day', () => {
    expect(wateringRecommendation(makeWeather()).text).toMatch(/balanced/i);
  });
  it('prioritizes rain over heat', () => {
    expect(wateringRecommendation(makeWeather({ precipitationProbability: 80, high: 95 })).text).toMatch(/rain/i);
  });
});

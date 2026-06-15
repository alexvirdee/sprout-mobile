/**
 * Plant domain types + option metadata (labels, emoji, accent). Mirrors the
 * backend Plant model / Zod enums.
 */

import { colors, palette } from '@theme/index';

export type PlantType =
  | 'vegetable' | 'herb' | 'fruit' | 'flower' | 'houseplant' | 'tree' | 'shrub' | 'succulent' | 'other';
export type PlantSource =
  | 'seed' | 'seedling' | 'transplant' | 'cutting' | 'store_bought' | 'other' | 'unknown';
export type SunPreference = 'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade' | 'not_sure';
export type WateringPreference = 'light' | 'moderate' | 'frequent' | 'deep' | 'not_sure';
export type PlantStatus = 'growing' | 'needs_attention' | 'harvested' | 'dormant' | 'archived';
export type PlantAccent = 'green' | 'sage' | 'gold' | 'terra' | 'info' | 'neutral';

export interface Plant {
  id: string;
  userId: string;
  gardenId: string;
  name: string;
  variety?: string;
  type: PlantType;
  plantedDate?: string | null;
  source: PlantSource;
  locationInGarden?: string;
  sunPreference: SunPreference;
  wateringPreference: WateringPreference;
  notes?: string;
  status: PlantStatus;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface PlantPayload {
  gardenId: string;
  name: string;
  variety?: string;
  type: PlantType;
  plantedDate?: string;
  source: PlantSource;
  locationInGarden?: string;
  sunPreference: SunPreference;
  wateringPreference: WateringPreference;
  notes?: string;
}

export interface PlantOption<T extends string> {
  value: T;
  label: string;
  emoji: string;
  accent: PlantAccent;
  hint?: string;
}

export const PLANT_TYPE_OPTIONS: PlantOption<PlantType>[] = [
  { value: 'vegetable', label: 'Vegetable', emoji: '🥕', accent: 'terra' },
  { value: 'herb', label: 'Herb', emoji: '🌿', accent: 'green' },
  { value: 'fruit', label: 'Fruit', emoji: '🍓', accent: 'terra' },
  { value: 'flower', label: 'Flower', emoji: '🌸', accent: 'gold' },
  { value: 'houseplant', label: 'Houseplant', emoji: '🪴', accent: 'sage' },
  { value: 'tree', label: 'Tree', emoji: '🌳', accent: 'green' },
  { value: 'shrub', label: 'Shrub', emoji: '🍃', accent: 'sage' },
  { value: 'succulent', label: 'Succulent', emoji: '🌵', accent: 'sage' },
  { value: 'other', label: 'Other', emoji: '🌱', accent: 'neutral' },
];

export const PLANT_SOURCE_OPTIONS: PlantOption<PlantSource>[] = [
  { value: 'seed', label: 'Seed', emoji: '🌰', accent: 'terra' },
  { value: 'seedling', label: 'Seedling', emoji: '🌱', accent: 'green' },
  { value: 'transplant', label: 'Transplant', emoji: '🪴', accent: 'sage' },
  { value: 'cutting', label: 'Cutting', emoji: '✂️', accent: 'gold' },
  { value: 'store_bought', label: 'Store-bought', emoji: '🛒', accent: 'info' },
  { value: 'other', label: 'Other', emoji: '✨', accent: 'neutral' },
  { value: 'unknown', label: 'Not sure', emoji: '🤷', accent: 'neutral' },
];

export const SUN_PREF_OPTIONS: PlantOption<SunPreference>[] = [
  { value: 'full_sun', label: 'Full sun', emoji: '☀️', accent: 'gold', hint: '6+ hours of direct sun' },
  { value: 'partial_sun', label: 'Partial sun', emoji: '🌤️', accent: 'gold', hint: '4–6 hours' },
  { value: 'partial_shade', label: 'Partial shade', emoji: '⛅', accent: 'sage', hint: '2–4 hours' },
  { value: 'full_shade', label: 'Full shade', emoji: '🌥️', accent: 'info', hint: 'Under 2 hours' },
  { value: 'not_sure', label: 'Not sure', emoji: '🤔', accent: 'neutral', hint: 'You can change this later' },
];

export const WATERING_PREF_OPTIONS: PlantOption<WateringPreference>[] = [
  { value: 'light', label: 'Light', emoji: '💧', accent: 'info', hint: 'A little, often' },
  { value: 'moderate', label: 'Moderate', emoji: '💦', accent: 'green', hint: 'Steady and balanced' },
  { value: 'frequent', label: 'Frequent', emoji: '🌊', accent: 'info', hint: 'Thirsty plant' },
  { value: 'deep', label: 'Deep watering', emoji: '🪣', accent: 'terra', hint: 'Less often, soak fully' },
  { value: 'not_sure', label: 'Not sure', emoji: '🤔', accent: 'neutral', hint: 'You can change this later' },
];

export const ACCENT_COLORS: Record<
  PlantAccent,
  { soft: string; fg: string; grad: readonly [string, string] }
> = {
  green: { soft: palette.green[50], fg: palette.green[700], grad: [palette.green[300], palette.green[500]] },
  sage: { soft: palette.sageScale[50], fg: palette.sageScale[700], grad: [palette.sageScale[300], palette.sageScale[500]] },
  gold: { soft: palette.gold[50], fg: palette.gold[700], grad: [palette.gold[300], palette.gold[500]] },
  terra: { soft: palette.terra[50], fg: palette.terra[600], grad: [palette.terra[300], palette.terra[500]] },
  info: { soft: colors.status.infoSoft, fg: colors.status.info, grad: ['#9FC3DC', colors.status.info] },
  neutral: { soft: palette.neutral[100], fg: palette.neutral[600], grad: [palette.neutral[300], palette.neutral[500]] },
};

/**
 * Garden domain types + option metadata (labels, emoji, accent colors) shared
 * across the gardens feature. Mirrors the backend Garden model / Zod enums.
 */

import { palette, colors } from '@theme/index';

export type GardenType =
  | 'backyard' | 'raised_beds' | 'balcony' | 'indoor' | 'community' | 'greenhouse' | 'other';
export type SunExposure =
  | 'full_sun' | 'partial_sun' | 'partial_shade' | 'full_shade' | 'unsure';
export type SizeType = 'small' | 'medium' | 'large' | 'custom';
export type DimensionUnit = 'ft' | 'm';
export type GardenAccent = 'green' | 'sage' | 'gold' | 'terra' | 'info' | 'neutral';

export interface GardenDimensions {
  length?: number;
  width?: number;
  unit?: DimensionUnit;
}

export interface Garden {
  id: string;
  userId: string;
  name: string;
  type: GardenType;
  locationLabel?: string;
  cityOrZip?: string;
  sunExposure: SunExposure;
  growingZone?: string;
  sizeType: SizeType;
  dimensions?: GardenDimensions;
  notes?: string;
  plantCount: number;
  taskCount: number;
  healthStatus: string;
  archivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Body sent to POST/PATCH /api/gardens. */
export interface GardenPayload {
  name: string;
  type: GardenType;
  locationLabel?: string;
  cityOrZip?: string;
  sunExposure: SunExposure;
  growingZone?: string;
  sizeType: SizeType;
  dimensions?: GardenDimensions;
  notes?: string;
}

export interface GardenOption<T extends string> {
  value: T;
  label: string;
  emoji: string;
  accent: GardenAccent;
  hint?: string;
}

export const GARDEN_TYPE_OPTIONS: GardenOption<GardenType>[] = [
  { value: 'backyard', label: 'Backyard', emoji: '🏡', accent: 'green' },
  { value: 'raised_beds', label: 'Raised beds', emoji: '🌱', accent: 'sage' },
  { value: 'balcony', label: 'Balcony', emoji: '🪴', accent: 'terra' },
  { value: 'indoor', label: 'Indoor', emoji: '🪟', accent: 'info' },
  { value: 'community', label: 'Community plot', emoji: '🤝', accent: 'gold' },
  { value: 'greenhouse', label: 'Greenhouse', emoji: '🏠', accent: 'green' },
  { value: 'other', label: 'Other', emoji: '✨', accent: 'neutral' },
];

export const SUN_EXPOSURE_OPTIONS: GardenOption<SunExposure>[] = [
  { value: 'full_sun', label: 'Full sun', emoji: '☀️', accent: 'gold', hint: '6+ hours of direct sun' },
  { value: 'partial_sun', label: 'Partial sun', emoji: '🌤️', accent: 'gold', hint: '4–6 hours' },
  { value: 'partial_shade', label: 'Partial shade', emoji: '⛅', accent: 'sage', hint: '2–4 hours' },
  { value: 'full_shade', label: 'Full shade', emoji: '🌥️', accent: 'info', hint: 'Under 2 hours' },
  { value: 'unsure', label: 'Not sure', emoji: '🤔', accent: 'neutral', hint: 'You can change this later' },
];

export const SIZE_TYPE_OPTIONS: GardenOption<SizeType>[] = [
  { value: 'small', label: 'Small', emoji: '🌱', accent: 'sage', hint: 'A few pots or a balcony' },
  { value: 'medium', label: 'Medium', emoji: '🌿', accent: 'green', hint: 'A bed or two' },
  { value: 'large', label: 'Large', emoji: '🌳', accent: 'green', hint: 'A full yard or plot' },
  { value: 'custom', label: 'Custom', emoji: '📐', accent: 'terra', hint: "I'll add dimensions" },
];

export const ACCENT_COLORS: Record<
  GardenAccent,
  { soft: string; fg: string; grad: readonly [string, string] }
> = {
  green: { soft: palette.green[50], fg: palette.green[700], grad: [palette.green[300], palette.green[500]] },
  sage: { soft: palette.sageScale[50], fg: palette.sageScale[700], grad: [palette.sageScale[300], palette.sageScale[500]] },
  gold: { soft: palette.gold[50], fg: palette.gold[700], grad: [palette.gold[300], palette.gold[500]] },
  terra: { soft: palette.terra[50], fg: palette.terra[600], grad: [palette.terra[300], palette.terra[500]] },
  info: { soft: colors.status.infoSoft, fg: colors.status.info, grad: ['#9FC3DC', colors.status.info] },
  neutral: { soft: palette.neutral[100], fg: palette.neutral[600], grad: [palette.neutral[300], palette.neutral[500]] },
};

export function gardenTypeMeta(type: GardenType): GardenOption<GardenType> {
  return GARDEN_TYPE_OPTIONS.find((o) => o.value === type) ?? GARDEN_TYPE_OPTIONS[6];
}
export function sunExposureMeta(sun: SunExposure): GardenOption<SunExposure> {
  return SUN_EXPOSURE_OPTIONS.find((o) => o.value === sun) ?? SUN_EXPOSURE_OPTIONS[4];
}
export function sizeTypeMeta(size: SizeType): GardenOption<SizeType> {
  return SIZE_TYPE_OPTIONS.find((o) => o.value === size) ?? SIZE_TYPE_OPTIONS[1];
}

/** Human-readable size summary, e.g. "Medium · 8 × 4 ft". */
export function sizeSummary(g: Pick<Garden, 'sizeType' | 'dimensions'>): string {
  const base = sizeTypeMeta(g.sizeType).label;
  const d = g.dimensions;
  if (d?.length && d?.width) return `${base} · ${d.length} × ${d.width} ${d.unit ?? 'ft'}`;
  return base;
}

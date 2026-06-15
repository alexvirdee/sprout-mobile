/**
 * plantLabels — lookups from a plant's enum values to friendly option metadata
 * (label / emoji / accent) and status → badge tone.
 */

import type { BadgeTone } from '@components/index';
import {
  PLANT_SOURCE_OPTIONS,
  PLANT_TYPE_OPTIONS,
  PlantOption,
  PlantSource,
  PlantStatus,
  PlantType,
  SUN_PREF_OPTIONS,
  SunPreference,
  WATERING_PREF_OPTIONS,
  WateringPreference,
} from '../types/plant.types';

function find<T extends string>(options: PlantOption<T>[], value: T): PlantOption<T> {
  return options.find((o) => o.value === value) ?? options[options.length - 1];
}

export const plantTypeMeta = (t: PlantType) => find(PLANT_TYPE_OPTIONS, t);
export const plantSourceMeta = (s: PlantSource) => find(PLANT_SOURCE_OPTIONS, s);
export const sunPrefMeta = (s: SunPreference) => find(SUN_PREF_OPTIONS, s);
export const wateringPrefMeta = (w: WateringPreference) => find(WATERING_PREF_OPTIONS, w);

export const PLANT_STATUS_META: Record<PlantStatus, { label: string; tone: BadgeTone }> = {
  growing: { label: 'Growing', tone: 'green' },
  needs_attention: { label: 'Needs attention', tone: 'warning' },
  harvested: { label: 'Harvested', tone: 'gold' },
  dormant: { label: 'Dormant', tone: 'neutral' },
  archived: { label: 'Archived', tone: 'neutral' },
};

export function statusMeta(status: PlantStatus) {
  return PLANT_STATUS_META[status] ?? PLANT_STATUS_META.growing;
}

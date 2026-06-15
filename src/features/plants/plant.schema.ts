/**
 * Plant form schema (Zod) + mappers between form values and the API payload.
 * All fields are plain strings/enums so the RHF input and output types align.
 * plantedDate is a YYYY-MM-DD string (or '' for "not set").
 */

import { z } from 'zod';

import {
  Plant,
  PlantPayload,
  PlantSource,
  PlantType,
  SunPreference,
  WateringPreference,
} from './types/plant.types';
import { todayISODate } from './utils/plantDates';

const plantTypes: [PlantType, ...PlantType[]] = [
  'vegetable', 'herb', 'fruit', 'flower', 'houseplant', 'tree', 'shrub', 'succulent', 'other',
];
const sources: [PlantSource, ...PlantSource[]] = [
  'seed', 'seedling', 'transplant', 'cutting', 'store_bought', 'other', 'unknown',
];
const sunPrefs: [SunPreference, ...SunPreference[]] = [
  'full_sun', 'partial_sun', 'partial_shade', 'full_shade', 'not_sure',
];
const wateringPrefs: [WateringPreference, ...WateringPreference[]] = [
  'light', 'moderate', 'frequent', 'deep', 'not_sure',
];

export const plantFormSchema = z.object({
  gardenId: z.string().min(1, 'Choose a garden'),
  name: z.string().min(1, 'Give your plant a name').max(80, 'That name is a little long'),
  variety: z.string().max(80),
  type: z.enum(plantTypes),
  plantedDate: z.string(),
  source: z.enum(sources),
  locationInGarden: z.string().max(120),
  sunPreference: z.enum(sunPrefs),
  wateringPreference: z.enum(wateringPrefs),
  notes: z.string().max(2000),
});

export type PlantFormValues = z.infer<typeof plantFormSchema>;

export function emptyPlantForm(gardenId = ''): PlantFormValues {
  return {
    gardenId,
    name: '',
    variety: '',
    type: 'other',
    plantedDate: todayISODate(),
    source: 'unknown',
    locationInGarden: '',
    sunPreference: 'not_sure',
    wateringPreference: 'not_sure',
    notes: '',
  };
}

export function toFormValues(p: Plant): PlantFormValues {
  return {
    gardenId: p.gardenId,
    name: p.name ?? '',
    variety: p.variety ?? '',
    type: p.type,
    plantedDate: p.plantedDate ? p.plantedDate.slice(0, 10) : '',
    source: p.source,
    locationInGarden: p.locationInGarden ?? '',
    sunPreference: p.sunPreference,
    wateringPreference: p.wateringPreference,
    notes: p.notes ?? '',
  };
}

export function toPayload(v: PlantFormValues): PlantPayload {
  const payload: PlantPayload = {
    gardenId: v.gardenId,
    name: v.name.trim(),
    type: v.type,
    source: v.source,
    sunPreference: v.sunPreference,
    wateringPreference: v.wateringPreference,
  };
  if (v.variety.trim()) payload.variety = v.variety.trim();
  if (v.locationInGarden.trim()) payload.locationInGarden = v.locationInGarden.trim();
  if (v.notes.trim()) payload.notes = v.notes.trim();
  if (v.plantedDate) payload.plantedDate = v.plantedDate;
  return payload;
}

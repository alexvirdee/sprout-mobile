/**
 * Garden form schema (Zod) + mappers between form values and the API payload.
 * Dimensions are captured as strings (TextInput) and parsed to numbers on submit.
 * All fields are plain strings/enums so the RHF input and output types align.
 */

import { z } from 'zod';

import {
  Garden,
  GardenPayload,
  GardenType,
  SunExposure,
  SizeType,
  DimensionUnit,
} from './types/garden.types';

const gardenTypes: [GardenType, ...GardenType[]] = [
  'backyard', 'raised_beds', 'balcony', 'indoor', 'community', 'greenhouse', 'other',
];
const sunExposures: [SunExposure, ...SunExposure[]] = [
  'full_sun', 'partial_sun', 'partial_shade', 'full_shade', 'unsure',
];
const sizeTypes: [SizeType, ...SizeType[]] = ['small', 'medium', 'large', 'custom'];
const units: [DimensionUnit, ...DimensionUnit[]] = ['ft', 'm'];

const numericString = z
  .string()
  .refine((v) => v.trim() === '' || (!Number.isNaN(Number(v)) && Number(v) > 0), 'Enter a number');

export const gardenFormSchema = z.object({
  name: z.string().min(2, 'Give your garden a name').max(80, 'That name is a little long'),
  type: z.enum(gardenTypes),
  locationLabel: z.string().max(120),
  cityOrZip: z.string().max(120),
  sunExposure: z.enum(sunExposures),
  growingZone: z.string().max(20),
  sizeType: z.enum(sizeTypes),
  length: numericString,
  width: numericString,
  unit: z.enum(units),
  notes: z.string().max(2000),
  // Set programmatically when a city is picked (not a text field).
  latitude: z.number().nullable(),
  longitude: z.number().nullable(),
});

export type GardenFormValues = z.infer<typeof gardenFormSchema>;

export const emptyGardenForm: GardenFormValues = {
  name: '',
  type: 'backyard',
  locationLabel: '',
  cityOrZip: '',
  sunExposure: 'unsure',
  growingZone: '',
  sizeType: 'medium',
  length: '',
  width: '',
  unit: 'ft',
  notes: '',
  latitude: null,
  longitude: null,
};

/** Map a saved garden into form values for editing. */
export function toFormValues(g: Garden): GardenFormValues {
  return {
    name: g.name ?? '',
    type: g.type,
    locationLabel: g.locationLabel ?? '',
    cityOrZip: g.cityOrZip ?? '',
    sunExposure: g.sunExposure,
    growingZone: g.growingZone ?? '',
    sizeType: g.sizeType,
    length: g.dimensions?.length != null ? String(g.dimensions.length) : '',
    width: g.dimensions?.width != null ? String(g.dimensions.width) : '',
    unit: g.dimensions?.unit ?? 'ft',
    notes: g.notes ?? '',
    latitude: g.latitude ?? null,
    longitude: g.longitude ?? null,
  };
}

/** Build the API payload, trimming text and omitting empty optionals. */
export function toPayload(v: GardenFormValues): GardenPayload {
  const payload: GardenPayload = {
    name: v.name.trim(),
    type: v.type,
    sunExposure: v.sunExposure,
    sizeType: v.sizeType,
  };
  if (v.locationLabel.trim()) payload.locationLabel = v.locationLabel.trim();
  if (v.cityOrZip.trim()) payload.cityOrZip = v.cityOrZip.trim();
  if (v.growingZone.trim()) payload.growingZone = v.growingZone.trim();
  if (v.notes.trim()) payload.notes = v.notes.trim();

  const length = v.length.trim() ? Number(v.length) : undefined;
  const width = v.width.trim() ? Number(v.width) : undefined;
  if (length != null || width != null) {
    payload.dimensions = {
      ...(length != null ? { length } : {}),
      ...(width != null ? { width } : {}),
      unit: v.unit,
    };
  }
  if (v.latitude != null) payload.latitude = v.latitude;
  if (v.longitude != null) payload.longitude = v.longitude;
  return payload;
}

/**
 * AI plant-identification types — mirror the backend /api/ai/plant-identify
 * response. Care fields reuse the Plant enums so a result can prefill creation.
 */

import { PlantType, SunPreference, WateringPreference } from '@features/plants/types/plant.types';

export type Difficulty = 'easy' | 'moderate' | 'hard' | 'unknown';

export interface PlantMatch {
  commonName: string;
  scientificName: string | null;
  confidence: number; // 0..1
}

export interface PlantCareSummary {
  sunPreference: SunPreference;
  wateringPreference: WateringPreference;
  difficulty: Difficulty;
  notes: string;
}

export interface PlantIdentification {
  isPlant: boolean;
  commonName: string | null;
  scientificName: string | null;
  confidence: number; // 0..1
  plantType: PlantType;
  possibleMatches: PlantMatch[];
  careSummary: PlantCareSummary;
  disclaimer: string;
}

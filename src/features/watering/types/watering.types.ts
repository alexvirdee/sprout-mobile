/**
 * Watering domain types + watering-type option metadata. Mirrors the backend
 * WateringLog model / Zod enums.
 */

export type WateringTarget = 'garden' | 'plant';
export type WateringType = 'light' | 'normal' | 'deep';

export interface WateringLog {
  id: string;
  userId: string;
  gardenId: string;
  plantId?: string;
  wateringTarget: WateringTarget;
  wateringType: WateringType;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface WateringStats {
  gardensWateredToday: number;
  plantsWateredToday: number;
  gardensNeedingAttention: number;
  totalGardens: number;
  currentStreak: number;
  weekSessions: number;
}

export interface WateringPayload {
  gardenId: string;
  plantId?: string;
  wateringTarget: WateringTarget;
  wateringType: WateringType;
  notes?: string;
}

export interface WateringTypeOption {
  value: WateringType;
  label: string;
  emoji: string;
  hint: string;
}

export const WATERING_TYPE_OPTIONS: WateringTypeOption[] = [
  { value: 'light', label: 'Light', emoji: '💧', hint: 'A gentle drink' },
  { value: 'normal', label: 'Normal', emoji: '💦', hint: 'A steady watering' },
  { value: 'deep', label: 'Deep', emoji: '🌊', hint: 'A thorough soak' },
];

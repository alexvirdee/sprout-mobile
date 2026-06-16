/**
 * confidence — turn a 0..1 AI confidence into a level, a friendly badge, and an
 * honest headline. Sprout never says "this is definitely…".
 */

import type { BadgeTone } from '@components/index';

export type ConfidenceLevel = 'high' | 'medium' | 'low';

export function confidenceLevel(confidence: number): ConfidenceLevel {
  if (confidence >= 0.75) return 'high';
  if (confidence >= 0.45) return 'medium';
  return 'low';
}

export function confidencePercent(confidence: number): number {
  return Math.round(Math.max(0, Math.min(1, confidence)) * 100);
}

export const CONFIDENCE_META: Record<ConfidenceLevel, { label: string; tone: BadgeTone }> = {
  high: { label: 'High confidence', tone: 'green' },
  medium: { label: 'Possible match', tone: 'gold' },
  low: { label: 'Low confidence', tone: 'warning' },
};

/** The headline shown on the result screen — honest about uncertainty. */
export function identificationHeadline(
  commonName: string | null,
  level: ConfidenceLevel,
  isPlant: boolean
): string {
  if (!isPlant) return "That doesn't look like a plant";
  if (!commonName) return "Sprout isn't totally sure";
  if (level === 'high') return `Looks like ${commonName}`;
  if (level === 'medium') return `This might be ${commonName}`;
  return "Sprout isn't totally sure";
}

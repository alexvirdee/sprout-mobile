/**
 * hydrationStatus — maps a garden/plant's lastWateredAt to a friendly status.
 * Rules: today → Healthy · 1–2d → Doing well · 3–4d → Check soon · 5+ → Needs
 * attention · never → Not watered yet. Pure + unit-testable.
 */

import type { BadgeTone } from '@components/index';

export type HydrationLevel = 'healthy' | 'doing_well' | 'check_soon' | 'needs_attention' | 'unknown';

export interface HydrationStatus {
  level: HydrationLevel;
  label: string;
  tone: BadgeTone;
  emoji: string;
}

/** Whole calendar days since last watered (0 = today), or null if never. */
export function daysSinceWatered(lastWateredAt?: string | null): number | null {
  if (!lastWateredAt) return null;
  const d = new Date(lastWateredAt);
  if (Number.isNaN(d.getTime())) return null;
  const startOf = (x: Date) => {
    const y = new Date(x);
    y.setHours(0, 0, 0, 0);
    return y.getTime();
  };
  const days = Math.round((startOf(new Date()) - startOf(d)) / 86_400_000);
  return days < 0 ? 0 : days;
}

export function hydrationStatus(lastWateredAt?: string | null): HydrationStatus {
  const days = daysSinceWatered(lastWateredAt);
  if (days == null) return { level: 'unknown', label: 'Not watered yet', tone: 'neutral', emoji: '🌱' };
  if (days === 0) return { level: 'healthy', label: 'Healthy', tone: 'green', emoji: '💧' };
  if (days <= 2) return { level: 'doing_well', label: 'Doing well', tone: 'sage', emoji: '🌿' };
  if (days <= 4) return { level: 'check_soon', label: 'Check soon', tone: 'gold', emoji: '👀' };
  return { level: 'needs_attention', label: 'Needs attention', tone: 'warning', emoji: '🍂' };
}

export function lastWateredLabel(lastWateredAt?: string | null): string {
  const days = daysSinceWatered(lastWateredAt);
  if (days == null) return 'Never watered';
  if (days === 0) return 'Watered today';
  if (days === 1) return 'Watered yesterday';
  if (days < 14) return `Watered ${days} days ago`;
  return `Watered ${Math.round(days / 7)} weeks ago`;
}

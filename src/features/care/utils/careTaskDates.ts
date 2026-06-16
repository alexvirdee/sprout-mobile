/**
 * careTaskDates — gentle due-date labels + grouping helpers. Calm language, no
 * harsh "overdue" (we say "Needs attention" / "Due …").
 */

import type { BadgeTone } from '@components/index';
import { relativeDay } from '@utils/format';

const startOf = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

/** Whole calendar days from today (negative = past). */
export function daysUntil(dueDate: string, now: Date = new Date()): number {
  const d = new Date(dueDate);
  if (Number.isNaN(d.getTime())) return 0;
  return Math.round((startOf(d) - startOf(now)) / 86_400_000);
}

export function dueLabel(dueDate: string, now: Date = new Date()): string {
  const days = daysUntil(dueDate, now);
  if (days < 0) return days === -1 ? 'Due yesterday' : `Due ${Math.abs(days)} days ago`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days < 7) return `In ${days} days`;
  return relativeDay(dueDate, now);
}

export function dueTone(dueDate: string, now: Date = new Date()): BadgeTone {
  const days = daysUntil(dueDate, now);
  if (days < 0) return 'warning';
  if (days === 0) return 'gold';
  return 'sage';
}

export type CareGroup = 'today' | 'week' | 'later';

/** Bucket a task's due date for the "Upcoming care" sections. */
export function careGroup(dueDate: string, now: Date = new Date()): CareGroup {
  const days = daysUntil(dueDate, now);
  if (days <= 0) return 'today';
  if (days <= 7) return 'week';
  return 'later';
}

export const CARE_GROUP_LABELS: Record<CareGroup, string> = {
  today: 'Today',
  week: 'This week',
  later: 'Later',
};

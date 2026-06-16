/**
 * Journal display helpers — entry-type metadata, harvest quantity formatting,
 * and a gentle relative date for the timeline.
 */

import { BadgeTone } from '@components/index';
import { JournalEntryType, JournalUnit } from '../types/journal.types';

export interface EntryTypeMeta {
  emoji: string;
  label: string;
  tone: BadgeTone;
}

const ENTRY_TYPE_META: Record<JournalEntryType, EntryTypeMeta> = {
  harvest: { emoji: '🧺', label: 'Harvest', tone: 'gold' },
  note: { emoji: '📝', label: 'Note', tone: 'sage' },
  milestone: { emoji: '🌟', label: 'Milestone', tone: 'green' },
};

export function entryTypeMeta(type: JournalEntryType): EntryTypeMeta {
  return ENTRY_TYPE_META[type] ?? ENTRY_TYPE_META.note;
}

export const JOURNAL_UNIT_OPTIONS: { value: JournalUnit; label: string }[] = [
  { value: 'count', label: 'Count' },
  { value: 'handful', label: 'Handfuls' },
  { value: 'bunch', label: 'Bunches' },
  { value: 'basket', label: 'Baskets' },
  { value: 'g', label: 'Grams' },
  { value: 'kg', label: 'Kilograms' },
  { value: 'oz', label: 'Ounces' },
  { value: 'lb', label: 'Pounds' },
];

/** Short unit suffix, pluralized loosely. "count" has no suffix (just a number). */
function unitSuffix(unit: JournalUnit, qty: number): string {
  const plural = qty === 1 ? '' : 's';
  switch (unit) {
    case 'count':
      return '';
    case 'g':
      return ' g';
    case 'kg':
      return ' kg';
    case 'oz':
      return ' oz';
    case 'lb':
      return ` lb`;
    case 'bunch':
      return ` bunch${qty === 1 ? '' : 'es'}`;
    case 'basket':
      return ` basket${plural}`;
    case 'handful':
      return ` handful${plural}`;
    default:
      return '';
  }
}

/** e.g. "6", "2 lb", "3 bunches". Returns null when there's no quantity. */
export function formatHarvest(quantity?: number | null, unit?: JournalUnit | null): string | null {
  if (quantity == null) return null;
  const qty = Number(quantity);
  if (!Number.isFinite(qty)) return null;
  const rounded = Number.isInteger(qty) ? qty : Math.round(qty * 10) / 10;
  return `${rounded}${unit ? unitSuffix(unit, rounded) : ''}`;
}

/** Gentle relative date: "Today", "Yesterday", "3 days ago", else a short date. */
export function formatOccurredAt(iso: string): string {
  const then = new Date(iso);
  if (Number.isNaN(then.getTime())) return '';
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(new Date()) - startOfDay(then)) / 86_400_000);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days > 1 && days < 7) return `${days} days ago`;
  return then.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

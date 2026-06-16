/**
 * Journal label/format helpers — harvest quantity formatting, relative dates,
 * and entry-type metadata.
 */

import { entryTypeMeta, formatHarvest, formatOccurredAt } from '@features/journal/utils/journalLabels';

describe('formatHarvest', () => {
  it('omits the unit for a plain count', () => {
    expect(formatHarvest(6, 'count')).toBe('6');
  });

  it('appends simple units', () => {
    expect(formatHarvest(2, 'lb')).toBe('2 lb');
    expect(formatHarvest(250, 'g')).toBe('250 g');
  });

  it('pluralizes counted units', () => {
    expect(formatHarvest(1, 'bunch')).toBe('1 bunch');
    expect(formatHarvest(3, 'bunch')).toBe('3 bunches');
    expect(formatHarvest(2, 'basket')).toBe('2 baskets');
    expect(formatHarvest(1, 'handful')).toBe('1 handful');
  });

  it('rounds fractional amounts to one decimal', () => {
    expect(formatHarvest(2.49, 'kg')).toBe('2.5 kg');
  });

  it('returns null when there is no quantity', () => {
    expect(formatHarvest(undefined)).toBeNull();
    expect(formatHarvest(null)).toBeNull();
  });
});

describe('formatOccurredAt', () => {
  const iso = (d: Date) => d.toISOString();
  const daysAgo = (n: number) => {
    const d = new Date();
    d.setDate(d.getDate() - n);
    return iso(d);
  };

  it('labels today and yesterday', () => {
    expect(formatOccurredAt(iso(new Date()))).toBe('Today');
    expect(formatOccurredAt(daysAgo(1))).toBe('Yesterday');
  });

  it('labels the last week in days', () => {
    expect(formatOccurredAt(daysAgo(3))).toBe('3 days ago');
  });

  it('falls back to a short date for older entries', () => {
    const label = formatOccurredAt(daysAgo(40));
    expect(label).not.toBe('Today');
    expect(label).not.toMatch(/ago/);
    expect(label.length).toBeGreaterThan(0);
  });
});

describe('entryTypeMeta', () => {
  it('maps each entry type to a label + emoji', () => {
    expect(entryTypeMeta('harvest').label).toBe('Harvest');
    expect(entryTypeMeta('harvest').emoji).toBe('🧺');
    expect(entryTypeMeta('note').label).toBe('Note');
    expect(entryTypeMeta('milestone').label).toBe('Milestone');
  });
});

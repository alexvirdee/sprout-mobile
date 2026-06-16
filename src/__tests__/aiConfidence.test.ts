/**
 * AI confidence logic — levels, percentage, and the honest headline copy.
 * Pure functions, tested directly.
 */

import { confidenceLevel, confidencePercent, identificationHeadline } from '@features/ai/utils/confidence';

describe('confidenceLevel', () => {
  it('is high at >= 0.75', () => {
    expect(confidenceLevel(0.75)).toBe('high');
    expect(confidenceLevel(0.92)).toBe('high');
  });
  it('is medium from 0.45 to 0.74', () => {
    expect(confidenceLevel(0.45)).toBe('medium');
    expect(confidenceLevel(0.6)).toBe('medium');
  });
  it('is low below 0.45', () => {
    expect(confidenceLevel(0.44)).toBe('low');
    expect(confidenceLevel(0.1)).toBe('low');
  });
});

describe('confidencePercent', () => {
  it('rounds to a whole percent', () => {
    expect(confidencePercent(0.823)).toBe(82);
  });
  it('clamps to 0..100', () => {
    expect(confidencePercent(1.4)).toBe(100);
    expect(confidencePercent(-0.2)).toBe(0);
  });
});

describe('identificationHeadline', () => {
  it('is confident at high confidence', () => {
    expect(identificationHeadline('Basil', 'high', true)).toBe('Looks like Basil');
  });
  it('hedges at medium confidence', () => {
    expect(identificationHeadline('Basil', 'medium', true)).toBe('This might be Basil');
  });
  it('admits uncertainty at low confidence', () => {
    expect(identificationHeadline('Basil', 'low', true)).toMatch(/isn't totally sure/i);
  });
  it('handles a missing name', () => {
    expect(identificationHeadline(null, 'high', true)).toMatch(/isn't totally sure/i);
  });
  it('handles a non-plant photo', () => {
    expect(identificationHeadline('Basil', 'high', false)).toMatch(/doesn't look like a plant/i);
  });
});

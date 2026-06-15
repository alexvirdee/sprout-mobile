/**
 * Sprout — Spacing
 * 8px base rhythm with a few half-steps. Generous by default — the brand breathes.
 * Ported from tokens/spacing.css (rem values converted to px @ 16px base).
 */

export const spacing = {
  none: 0,
  xs: 4, // space-1
  sm: 8, // space-2
  md: 12, // space-3
  base: 16, // space-4
  lg: 24, // space-5
  xl: 32, // space-6
  '2xl': 40, // space-7
  '3xl': 48, // space-8
  '4xl': 64, // space-9
  '5xl': 80, // space-10
  '6xl': 104, // space-11
  '7xl': 128, // space-12
} as const;

/** Numeric scale matching the design system step names (space-0 … space-12). */
export const space = [0, 4, 8, 12, 16, 24, 32, 40, 48, 64, 80, 104, 128] as const;

/** Default screen gutter (page horizontal padding). */
export const gutter = 20;

export type Spacing = typeof spacing;

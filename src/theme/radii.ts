/**
 * Sprout — Corner radii
 * Large, organic rounded corners. Ported from tokens/radii.css.
 */

export const radii = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 22,
  xl: 30,
  '2xl': 40,
  '3xl': 56,
  pill: 999,
} as const;

export type Radii = typeof radii;

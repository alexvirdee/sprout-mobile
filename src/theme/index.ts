/**
 * Sprout — Theme entry point.
 * A single `theme` object aggregates every token group so components can pull
 * from one place. Prefer `useTheme()` inside components.
 */

import { Easing } from 'react-native';

import { colors, palette } from './colors';
import { gradients } from './gradients';
import { radii } from './radii';
import { shadows } from './shadows';
import { gutter, space, spacing } from './spacing';
import { fontFamily, fontSize, lineHeight, typography } from './typography';

/** Gentle, natural motion — durations (ms) and easing curves. */
export const motion = {
  duration: {
    fast: 140,
    base: 240,
    slow: 420,
  },
  easing: {
    // cubic-bezier(0.22, 1, 0.36, 1)
    out: Easing.bezier(0.22, 1, 0.36, 1),
    // cubic-bezier(0.65, 0, 0.35, 1)
    inOut: Easing.bezier(0.65, 0, 0.35, 1),
    // cubic-bezier(0.34, 1.56, 0.64, 1)
    spring: Easing.bezier(0.34, 1.56, 0.64, 1),
  },
} as const;

export const theme = {
  colors,
  palette,
  spacing,
  space,
  gutter,
  radii,
  shadows,
  gradients,
  typography,
  fontFamily,
  fontSize,
  lineHeight,
  motion,
} as const;

export type Theme = typeof theme;

export { colors, palette } from './colors';
export { spacing, space, gutter } from './spacing';
export { radii } from './radii';
export { shadows } from './shadows';
export { gradients } from './gradients';
export type { GradientName } from './gradients';
export { typography, fontFamily, fontSize, lineHeight } from './typography';
export type { TypographyVariant } from './typography';
export { ThemeProvider, useTheme } from './ThemeProvider';

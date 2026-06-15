/**
 * Sprout — Shadows
 * Soft, warm-tinted (brown), layered — never pure-black, never harsh.
 * CSS box-shadows are approximated as RN shadow objects (iOS) plus an
 * `elevation` value (Android). Brown tint: rgba(90, 70, 52, …).
 */

import { Platform, ViewStyle } from 'react-native';

const SHADOW_TINT = '#5A4634';

type Shadow = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const make = (
  offsetY: number,
  radius: number,
  opacity: number,
  elevation: number,
  color: string = SHADOW_TINT
): Shadow =>
  Platform.select<Shadow>({
    ios: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
    android: { elevation },
    default: {
      shadowColor: color,
      shadowOffset: { width: 0, height: offsetY },
      shadowOpacity: opacity,
      shadowRadius: radius,
    },
  }) as Shadow;

export const shadows = {
  none: {} as Shadow,
  xs: make(1, 2, 0.06, 1),
  sm: make(2, 6, 0.1, 2),
  md: make(6, 14, 0.12, 5),
  lg: make(14, 28, 0.14, 10),
  xl: make(24, 48, 0.16, 18),
  // Colored glows for primary / accent surfaces.
  brand: make(12, 24, 0.28, 8, '#4CAF50'),
  gold: make(12, 24, 0.3, 8, '#F4B942'),
} as const;

export type Shadows = typeof shadows;

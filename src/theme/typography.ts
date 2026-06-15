/**
 * Sprout — Typography
 * Outfit (display/headings) + Hanken Grotesk (body) + JetBrains Mono (data).
 * Ported from tokens/typography.css and adapted for React Native:
 *  - lineHeight is absolute (px) in RN, so values are pre-multiplied.
 *  - letterSpacing is in px, so em tracking is converted per size.
 *
 * Font family strings match the keys exported by @expo-google-fonts/* and
 * loaded in ThemeProvider. If a font fails to load, RN falls back to system.
 */

export const fontFamily = {
  // Outfit (headings / display)
  displayLight: 'Outfit_300Light',
  display: 'Outfit_400Regular',
  displayMedium: 'Outfit_500Medium',
  displaySemibold: 'Outfit_600SemiBold',
  displayBold: 'Outfit_700Bold',
  displayExtra: 'Outfit_800ExtraBold',

  // Hanken Grotesk (body)
  body: 'HankenGrotesk_400Regular',
  bodyMedium: 'HankenGrotesk_500Medium',
  bodySemibold: 'HankenGrotesk_600SemiBold',
  bodyBold: 'HankenGrotesk_700Bold',

  // JetBrains Mono (data / code)
  mono: 'JetBrainsMono_400Regular',
  monoMedium: 'JetBrainsMono_500Medium',
} as const;

export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  md: 18,
  lg: 22,
  xl: 28,
  '2xl': 34,
  '3xl': 44,
  '4xl': 56,
} as const;

export const lineHeight = {
  tight: 1.08,
  snug: 1.2,
  normal: 1.45,
  relaxed: 1.65,
} as const;

type TextStyle = {
  fontFamily: string;
  fontSize: number;
  lineHeight: number;
  letterSpacing?: number;
  textTransform?: 'uppercase' | 'none';
};

/**
 * Semantic text variants — the public typography API consumed by <Text>.
 */
export const typography: Record<string, TextStyle> = {
  displayLarge: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['3xl'],
    lineHeight: Math.round(fontSize['3xl'] * lineHeight.tight),
    letterSpacing: -1.3,
  },
  display: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize['2xl'],
    lineHeight: Math.round(fontSize['2xl'] * lineHeight.tight),
    letterSpacing: -1,
  },
  h1: {
    fontFamily: fontFamily.displayBold,
    fontSize: fontSize.xl,
    lineHeight: Math.round(fontSize.xl * lineHeight.snug),
    letterSpacing: -0.6,
  },
  h2: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: fontSize.lg,
    lineHeight: Math.round(fontSize.lg * lineHeight.snug),
    letterSpacing: -0.4,
  },
  h3: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: fontSize.md,
    lineHeight: Math.round(fontSize.md * lineHeight.snug),
    letterSpacing: -0.2,
  },
  title: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 16,
    lineHeight: Math.round(16 * lineHeight.snug),
    letterSpacing: -0.2,
  },
  bodyLarge: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.md,
    lineHeight: Math.round(fontSize.md * lineHeight.relaxed),
  },
  body: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.base,
    lineHeight: Math.round(fontSize.base * lineHeight.relaxed),
  },
  bodySmall: {
    fontFamily: fontFamily.body,
    fontSize: fontSize.sm,
    lineHeight: Math.round(fontSize.sm * lineHeight.normal),
  },
  label: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 13.5,
    lineHeight: Math.round(13.5 * lineHeight.snug),
  },
  caption: {
    fontFamily: fontFamily.body,
    fontSize: 12.5,
    lineHeight: Math.round(12.5 * lineHeight.normal),
  },
  eyebrow: {
    fontFamily: fontFamily.displaySemibold,
    fontSize: 12,
    lineHeight: Math.round(12 * lineHeight.normal),
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },
  mono: {
    fontFamily: fontFamily.mono,
    fontSize: fontSize.sm,
    lineHeight: Math.round(fontSize.sm * lineHeight.normal),
  },
};

export type TypographyVariant = keyof typeof typography;

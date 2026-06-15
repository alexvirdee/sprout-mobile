/**
 * Sprout — Color system
 * "Apple meets a botanical garden." Warm, optimistic, peaceful.
 *
 * Ported verbatim from the Sprout design system (tokens/colors.css).
 * Build UI with the semantic aliases (`colors.surface.card`, `colors.text.body`…);
 * reach for raw scale steps only for fine-tuning.
 */

export const palette = {
  // Brand seeds
  sproutGreen: '#4CAF50',
  sage: '#A8C686',
  harvestGold: '#F4B942',
  terracotta: '#C86B3C',
  warmCream: '#FAF8F2',
  earthBrown: '#5A4634',
  stone: '#E7E2D8',

  // Green scale (primary)
  green: {
    50: '#EDF7ED',
    100: '#D4ECD5',
    200: '#ABDBAD',
    300: '#82C985',
    400: '#66BC6A',
    500: '#4CAF50',
    600: '#3D9A41',
    700: '#2F7D33',
    800: '#245F27',
    900: '#1B481E',
  },

  // Sage scale (secondary)
  sageScale: {
    50: '#F3F7EC',
    100: '#E6EFD7',
    200: '#CFE0B6',
    300: '#BAD49B',
    400: '#A8C686',
    500: '#94B86E',
    600: '#7A9E55',
    700: '#5F7C43',
    800: '#475D33',
    900: '#354627',
  },

  // Harvest Gold scale (accent)
  gold: {
    50: '#FEF8E9',
    100: '#FCEDC4',
    200: '#F9DD93',
    300: '#F6CB63',
    400: '#F4B942',
    500: '#EBA51F',
    600: '#CE8612',
    700: '#A2670F',
    800: '#7C4F12',
    900: '#654113',
  },

  // Terracotta scale (supporting)
  terra: {
    50: '#FAEEE7',
    100: '#F2D8C7',
    200: '#E5B499',
    300: '#D8906C',
    400: '#C86B3C',
    500: '#B25A2E',
    600: '#934826',
    700: '#74381E',
    800: '#582B17',
    900: '#422013',
  },

  // Warm neutrals (earth + stone + cream)
  neutral: {
    0: '#FFFFFF',
    50: '#FAF8F2', // warm cream
    100: '#F3EFE6',
    150: '#ECE6D9',
    200: '#E7E2D8', // stone
    300: '#D4CCBC',
    400: '#B3A892',
    500: '#8C7F6A',
    600: '#6E6049',
    700: '#5A4634', // earth brown
    800: '#433527',
    850: '#392B1F',
    900: '#2A2017',
  },

  // Status
  success: '#4CAF50',
  successSoft: '#EDF7ED',
  warning: '#EBA51F',
  warningSoft: '#FEF8E9',
  danger: '#D2503A',
  dangerSoft: '#FBEAE6',
  info: '#5B8BB0',
  infoSoft: '#EAF1F6',
} as const;

/**
 * Semantic aliases — the surface of the color API.
 * Use these in components rather than raw palette steps.
 */
export const colors = {
  // Surfaces
  surface: {
    page: palette.warmCream,
    card: palette.neutral[0],
    raised: palette.neutral[0],
    sunken: palette.neutral[100],
    muted: palette.neutral[100],
    inverse: palette.neutral[700],
    brandSoft: palette.green[50],
    sageSoft: palette.sageScale[50],
    goldSoft: palette.gold[50],
    terraSoft: palette.terra[50],
  },

  // Text
  text: {
    strong: '#3A2D20',
    body: palette.earthBrown,
    muted: palette.neutral[500],
    subtle: palette.neutral[400],
    onBrand: '#FFFFFF',
    onGold: '#5A4634',
    inverse: palette.warmCream,
    link: palette.green[700],
  },

  // Borders
  border: {
    soft: palette.neutral[200],
    default: palette.neutral[300],
    strong: palette.neutral[400],
    brand: palette.green[300],
  },

  // Brand actions
  action: {
    primary: palette.green[500],
    primaryHover: palette.green[600],
    primaryActive: palette.green[700],
    accent: palette.gold[400],
    accentHover: palette.gold[500],
  },

  // Focus ring (45% sprout green over transparent)
  ringFocus: 'rgba(76, 175, 80, 0.45)',

  // Status
  status: {
    success: palette.success,
    successSoft: palette.successSoft,
    warning: palette.warning,
    warningSoft: palette.warningSoft,
    danger: palette.danger,
    dangerSoft: palette.dangerSoft,
    info: palette.info,
    infoSoft: palette.infoSoft,
  },
} as const;

export type Palette = typeof palette;
export type Colors = typeof colors;

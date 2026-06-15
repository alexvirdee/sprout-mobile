/**
 * Sprout — Gentle brand gradients
 * Soft, naturalistic washes. Ported from tokens/radii.css (--gradient-*).
 * Each entry is { colors, start, end } for expo-linear-gradient.
 */

type Gradient = {
  colors: string[];
  start: { x: number; y: number };
  end: { x: number; y: number };
  locations?: number[];
};

// 135deg ≈ top-left → bottom-right
const diagonal = { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } };
// 160deg-ish ≈ mostly vertical with slight lean
const steep = { start: { x: 0.15, y: 0 }, end: { x: 0.85, y: 1 } };
// 180deg ≈ top → bottom
const vertical = { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } };

export const gradients: Record<string, Gradient> = {
  sun: { colors: ['#FDEFC9', '#FAF8F2'], ...diagonal, locations: [0, 0.6] },
  meadow: { colors: ['#EDF7ED', '#F3F7EC', '#FAF8F2'], ...steep, locations: [0, 0.5, 1] },
  leaf: { colors: ['#66BC6A', '#3D9A41'], ...diagonal },
  harvest: { colors: ['#F6CB63', '#C86B3C'], ...diagonal },
  dawn: { colors: ['#FCEFD2', '#F6F8EC'], ...vertical },
};

export type GradientName = keyof typeof gradients;

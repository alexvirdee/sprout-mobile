/**
 * GradientBackground — full-bleed brand gradient wrapper used on splash,
 * onboarding, and hero headers.
 */

import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { gradients, GradientName } from '@theme/index';

export interface GradientBackgroundProps {
  children?: React.ReactNode;
  gradient?: GradientName;
  style?: ViewStyle;
}

export function GradientBackground({
  children,
  gradient = 'meadow',
  style,
}: GradientBackgroundProps) {
  const g = gradients[gradient];
  return (
    <LinearGradient
      colors={g.colors}
      start={g.start}
      end={g.end}
      locations={g.locations as [number, number, ...number[]] | undefined}
      style={[styles.fill, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
});

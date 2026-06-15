/**
 * SeasonalTipCard — a small delightful "tip of the day" card on a warm gradient.
 */

import React from 'react';
import { StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Text } from '@components/index';
import { gradients, palette, radii, spacing } from '@theme/index';
import { GardenTip } from '../hooks/useDailyGardenTip';

export interface SeasonalTipCardProps {
  tip: GardenTip;
}

export function SeasonalTipCard({ tip }: SeasonalTipCardProps) {
  return (
    <LinearGradient
      colors={gradients.sun.colors}
      start={gradients.sun.start}
      end={gradients.sun.end}
      style={styles.card}
    >
      <Text variant="eyebrow" tint={palette.gold[700]}>Tip of the day</Text>
      <Text variant="h2" color="strong" style={styles.title}>{tip.title}</Text>
      <Text variant="body" color="muted" style={styles.body}>{tip.body}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.gold[100],
  },
  title: { marginTop: 6 },
  body: { marginTop: 6 },
});

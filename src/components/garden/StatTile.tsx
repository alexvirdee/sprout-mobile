/**
 * StatTile — compact dashboard metric: icon chip, big number, label, optional
 * delta. Data should read like encouragement ("24 growing", "+3 this week").
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, palette, radii, shadows } from '@theme/index';
import { Text } from '../ui/Text';

type Tone = 'green' | 'gold' | 'terra' | 'sage' | 'info';

const TONES: Record<Tone, { soft: string; fg: string }> = {
  green: { soft: palette.green[50], fg: palette.green[700] },
  gold: { soft: palette.gold[50], fg: palette.gold[700] },
  terra: { soft: palette.terra[50], fg: palette.terra[600] },
  sage: { soft: palette.sageScale[50], fg: palette.sageScale[700] },
  info: { soft: colors.status.infoSoft, fg: colors.status.info },
};

export interface StatTileProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  delta?: string;
  tone?: Tone;
  style?: ViewStyle;
}

export function StatTile({ icon, value, label, delta, tone = 'green', style }: StatTileProps) {
  const t = TONES[tone];
  return (
    <View style={[styles.card, style]}>
      <View style={[styles.chip, { backgroundColor: t.soft }]}>{icon}</View>
      <View>
        <View style={styles.valueRow}>
          <Text variant="display" color="strong" style={styles.value}>
            {value}
          </Text>
          {delta ? (
            <Text variant="label" tint={t.fg} style={styles.delta}>
              {delta}
            </Text>
          ) : null}
        </View>
        <Text variant="bodySmall" color="muted" style={styles.label}>
          {label}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.soft,
    borderRadius: radii.lg,
    padding: 16,
    rowGap: 14,
    ...shadows.sm,
  },
  chip: {
    width: 42,
    height: 42,
    borderRadius: radii.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', columnGap: 8 },
  value: { fontSize: 30, lineHeight: 32 },
  delta: { fontSize: 13 },
  label: { marginTop: 4 },
});

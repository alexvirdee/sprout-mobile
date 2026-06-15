/**
 * Badge — small status / category pill. Tones map to the brand palette.
 * Use `solid` for high-emphasis states (e.g. "Harvest ready").
 */

import React from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, palette, radii } from '@theme/index';
import { Text } from './Text';

export type BadgeTone =
  | 'green'
  | 'sage'
  | 'gold'
  | 'terra'
  | 'neutral'
  | 'success'
  | 'warning'
  | 'danger';

const TONES: Record<BadgeTone, { bg: string; fg: string }> = {
  green: { bg: palette.green[100], fg: palette.green[800] },
  sage: { bg: palette.sageScale[100], fg: palette.sageScale[800] },
  gold: { bg: palette.gold[100], fg: palette.gold[800] },
  terra: { bg: palette.terra[100], fg: palette.terra[700] },
  neutral: { bg: palette.neutral[150], fg: palette.neutral[700] },
  success: { bg: colors.status.successSoft, fg: palette.green[800] },
  warning: { bg: colors.status.warningSoft, fg: palette.gold[800] },
  danger: { bg: colors.status.dangerSoft, fg: colors.status.danger },
};

export interface BadgeProps {
  label: string;
  tone?: BadgeTone;
  solid?: boolean;
  dot?: boolean;
  style?: ViewStyle;
}

export function Badge({ label, tone = 'green', solid = false, dot = false, style }: BadgeProps) {
  const t = TONES[tone];
  const fg = solid ? '#FFFFFF' : t.fg;
  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: solid ? t.fg : t.bg },
        style,
      ]}
    >
      {dot ? <View style={[styles.dot, { backgroundColor: fg }]} /> : null}
      <Text variant="label" tint={fg} style={styles.label}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: radii.pill,
    alignSelf: 'flex-start',
  },
  dot: { width: 7, height: 7, borderRadius: 999 },
  label: { fontSize: 12.5, letterSpacing: 0.1 },
});

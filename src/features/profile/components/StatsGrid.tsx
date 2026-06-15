/**
 * StatsGrid — the gardening-stats tiles, all from real data. Zero is shown
 * honestly with a gentle hint ("Create your first") so an empty profile still
 * encourages. Gardens / Plants / Waterings tiles are tappable shortcuts.
 */

import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { CircleCheck, Droplets, Flame, Leaf, ShoppingBasket, Sprout } from 'lucide-react-native';

import { Text } from '@components/index';
import { colors, palette, radii, shadows } from '@theme/index';
import { ProfileStats } from '../types/profile.types';

type Tone = 'green' | 'sage' | 'gold' | 'terra' | 'info';

const TONES: Record<Tone, { soft: string; fg: string }> = {
  green: { soft: palette.green[50], fg: palette.green[700] },
  sage: { soft: palette.sageScale[50], fg: palette.sageScale[700] },
  gold: { soft: palette.gold[50], fg: palette.gold[700] },
  terra: { soft: palette.terra[50], fg: palette.terra[600] },
  info: { soft: colors.status.infoSoft, fg: colors.status.info },
};

export interface StatsGridProps {
  stats: ProfileStats;
  onPressGardens?: () => void;
  onPressPlants?: () => void;
  onPressWaterings?: () => void;
}

export function StatsGrid({ stats, onPressGardens, onPressPlants, onPressWaterings }: StatsGridProps) {
  const cells = [
    { key: 'gardens', tone: 'green' as Tone, value: stats.gardens, label: 'Gardens', hint: 'Create your first', icon: Sprout, onPress: onPressGardens },
    { key: 'plants', tone: 'sage' as Tone, value: stats.plants, label: 'Plants', hint: 'Start growing', icon: Leaf, onPress: onPressPlants },
    { key: 'waterings', tone: 'info' as Tone, value: stats.wateringSessions, label: 'Waterings', hint: 'One tap away', icon: Droplets, onPress: onPressWaterings },
    { key: 'harvests', tone: 'gold' as Tone, value: stats.harvests, label: 'Harvests', hint: 'Awaiting your first', icon: ShoppingBasket },
    { key: 'tasks', tone: 'green' as Tone, value: stats.tasksCompleted, label: 'Tasks done', hint: undefined, icon: CircleCheck },
    { key: 'streak', tone: 'gold' as Tone, value: stats.currentStreak, label: 'Day streak', hint: 'Start today', icon: Flame },
  ];

  return (
    <View style={styles.grid}>
      {cells.map((c) => {
        const t = TONES[c.tone];
        const Icon = c.icon;
        const showHint = c.value === 0 && !!c.hint;
        const inner = (
          <View style={styles.cell}>
            <View style={[styles.chip, { backgroundColor: t.soft }]}>
              <Icon size={18} color={t.fg} />
            </View>
            <Text variant="display" color="strong" style={styles.value}>
              {c.value}
            </Text>
            <Text variant="bodySmall" color="muted">
              {c.label}
            </Text>
            {showHint ? (
              <Text variant="caption" color="subtle" numberOfLines={1} style={styles.hint}>
                {c.hint}
              </Text>
            ) : null}
          </View>
        );
        if (c.onPress) {
          return (
            <Pressable
              key={c.key}
              accessibilityRole="button"
              onPress={c.onPress}
              style={({ pressed }): ViewStyle => ({ ...styles.cellWrap, opacity: pressed ? 0.85 : 1 })}
            >
              {inner}
            </Pressable>
          );
        }
        return (
          <View key={c.key} style={styles.cellWrap}>
            {inner}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cellWrap: { width: '47%', flexGrow: 1 },
  cell: {
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.soft,
    borderRadius: radii.lg,
    padding: 16,
    rowGap: 6,
    ...shadows.sm,
  },
  chip: { width: 42, height: 42, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  value: { fontSize: 28, lineHeight: 32 },
  hint: { marginTop: 1 },
});

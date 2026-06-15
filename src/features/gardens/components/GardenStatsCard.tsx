/**
 * GardenStatsCard — a 2×2 grid of garden-level stats (plants, tasks, harvested,
 * health). Numbers are placeholders until plants/tasks/harvests are attached.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { CircleCheck, Heart, Leaf, ShoppingBasket } from 'lucide-react-native';

import { Badge, Text } from '@components/index';
import { colors, palette, radii, shadows } from '@theme/index';
import { Garden } from '../types/garden.types';

export interface GardenStatsCardProps {
  garden: Garden;
}

export function GardenStatsCard({ garden }: GardenStatsCardProps) {
  return (
    <View style={styles.grid}>
      <Cell soft={palette.green[50]} icon={<Leaf size={16} color={palette.green[700]} />} value={String(garden.plantCount)} label="Plants" />
      <Cell soft={palette.sageScale[50]} icon={<CircleCheck size={16} color={palette.sageScale[700]} />} value={String(garden.taskCount)} label="Tasks" />
      <Cell soft={palette.gold[50]} icon={<ShoppingBasket size={16} color={palette.gold[700]} />} value="0 lb" label="Harvested" />
      <View style={styles.cell}>
        <View style={[styles.chip, { backgroundColor: palette.terra[50] }]}>
          <Heart size={16} color={palette.terra[600]} />
        </View>
        <Badge label={garden.healthStatus} tone="sage" style={styles.healthBadge} />
        <Text variant="caption" color="muted">Health</Text>
      </View>
    </View>
  );
}

function Cell({ soft, icon, value, label }: { soft: string; icon: React.ReactNode; value: string; label: string }) {
  return (
    <View style={styles.cell}>
      <View style={[styles.chip, { backgroundColor: soft }]}>{icon}</View>
      <Text variant="h2" color="strong" numberOfLines={1}>{value}</Text>
      <Text variant="caption" color="muted">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: {
    width: '47%',
    flexGrow: 1,
    rowGap: 8,
    padding: 16,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.soft,
    borderRadius: radii.lg,
    ...shadows.sm,
  },
  chip: { width: 36, height: 36, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  healthBadge: { marginTop: 2 },
});

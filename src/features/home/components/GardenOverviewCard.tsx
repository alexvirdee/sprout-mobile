/**
 * GardenOverviewCard — "Your gardens" section: a rollup stat strip (gardens /
 * plants / tasks) + a mood badge + the top garden rows, with a "See all" action.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Badge, Card, SectionHeader, Text } from '@components/index';
import { colors, spacing } from '@theme/index';
import { Garden } from '@features/gardens/types/garden.types';
import { GardenSummaryList } from './GardenSummaryList';

export interface GardenOverviewCardProps {
  gardens: Garden[];
  totalPlants: number;
  totalTasks: number;
  mood: string;
  onSeeAll: () => void;
  onPressGarden: (id: string) => void;
}

export function GardenOverviewCard({
  gardens,
  totalPlants,
  totalTasks,
  mood,
  onSeeAll,
  onPressGarden,
}: GardenOverviewCardProps) {
  return (
    <View style={styles.section}>
      <SectionHeader title="Your gardens" actionLabel="See all" onActionPress={onSeeAll} />

      <Card padding="md" radius="lg">
        <View style={styles.stats}>
          <Stat value={String(gardens.length)} label="Gardens" />
          <View style={styles.divider} />
          <Stat value={String(totalPlants)} label="Plants" />
          <View style={styles.divider} />
          <Stat value={String(totalTasks)} label="Tasks" />
        </View>
        <View style={styles.moodRow}>
          <Badge label={mood} tone="green" dot />
        </View>
      </Card>

      <View style={styles.rows}>
        <GardenSummaryList gardens={gardens.slice(0, 3)} onPressGarden={onPressGarden} />
      </View>
    </View>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text variant="h1" color="strong">{value}</Text>
      <Text variant="caption" color="muted">{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {},
  stats: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around' },
  stat: { alignItems: 'center', rowGap: 2 },
  divider: { width: 1, height: 34, backgroundColor: colors.border.soft },
  moodRow: { alignItems: 'center', marginTop: spacing.base },
  rows: { marginTop: spacing.base },
});

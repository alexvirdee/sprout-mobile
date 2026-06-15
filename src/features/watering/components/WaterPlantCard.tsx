/**
 * WaterPlantCard — one plant in the per-garden watering view. Secondary to
 * garden-level watering, but still a single tap: accent disc, name, hydration
 * line, and a QuickWaterButton scoped to this plant.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Card, Emoji, Text } from '@components/index';
import { radii } from '@theme/index';
import { ACCENT_COLORS, Plant } from '@features/plants/types/plant.types';
import { plantTypeMeta } from '@features/plants/utils/plantLabels';
import { daysSinceWatered, lastWateredLabel } from '../utils/hydrationStatus';
import { QuickWaterButton } from './QuickWaterButton';

export interface WaterPlantCardProps {
  plant: Plant;
  onQuickWater: () => void;
}

export function WaterPlantCard({ plant, onQuickWater }: WaterPlantCardProps) {
  const meta = plantTypeMeta(plant.type);
  const accent = ACCENT_COLORS[meta.accent];
  const wateredToday = daysSinceWatered(plant.lastWateredAt) === 0;

  return (
    <Card padding="sm" radius="lg">
      <View style={styles.row}>
        <LinearGradient colors={accent.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.disc}>
          <Emoji size={20}>{meta.emoji}</Emoji>
        </LinearGradient>
        <View style={styles.text}>
          <Text variant="title" color="strong" numberOfLines={1}>
            {plant.name}
          </Text>
          <Text variant="caption" color="muted" numberOfLines={1}>
            {lastWateredLabel(plant.lastWateredAt)}
          </Text>
        </View>
        <QuickWaterButton onWater={onQuickWater} watered={wateredToday} size="sm" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  disc: { width: 44, height: 44, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, rowGap: 2 },
});

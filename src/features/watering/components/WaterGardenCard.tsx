/**
 * WaterGardenCard — one garden in the Water tab. The header (disc + name +
 * hydration line) opens plant-level watering; the QuickWaterButton waters the
 * whole garden in a single tap. This is the primary <5s path.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';

import { Badge, Card, Emoji, Text } from '@components/index';
import { colors, radii } from '@theme/index';
import { ACCENT_COLORS, Garden, gardenTypeMeta } from '@features/gardens/types/garden.types';
import { daysSinceWatered, hydrationStatus, lastWateredLabel } from '../utils/hydrationStatus';
import { QuickWaterButton } from './QuickWaterButton';

export interface WaterGardenCardProps {
  garden: Garden;
  onQuickWater: () => void;
  onPress?: () => void;
}

export function WaterGardenCard({ garden, onQuickWater, onPress }: WaterGardenCardProps) {
  const meta = gardenTypeMeta(garden.type);
  const accent = ACCENT_COLORS[meta.accent];
  const hydration = hydrationStatus(garden.lastWateredAt);
  const wateredToday = daysSinceWatered(garden.lastWateredAt) === 0;
  const plants = `${garden.plantCount} ${garden.plantCount === 1 ? 'plant' : 'plants'}`;

  return (
    <Card padding="md" radius="lg" elevation="sm">
      <Pressable
        accessibilityRole={onPress ? 'button' : undefined}
        onPress={onPress}
        disabled={!onPress}
        style={styles.header}
      >
        <LinearGradient colors={accent.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.disc}>
          <Emoji size={24}>{meta.emoji}</Emoji>
        </LinearGradient>
        <View style={styles.titleCol}>
          <Text variant="h3" color="strong" numberOfLines={1}>
            {garden.name}
          </Text>
          <Text variant="caption" color="muted" numberOfLines={1}>
            {plants} · {lastWateredLabel(garden.lastWateredAt)}
          </Text>
        </View>
        {onPress ? <ChevronRight size={20} color={colors.text.subtle} /> : null}
      </Pressable>

      <View style={styles.footer}>
        <Badge label={hydration.label} tone={hydration.tone} dot />
        <QuickWaterButton onWater={onQuickWater} watered={wateredToday} size="sm" />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  disc: { width: 50, height: 50, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  titleCol: { flex: 1, rowGap: 3 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
  },
});

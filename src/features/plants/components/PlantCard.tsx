/**
 * PlantCard — a tappable plant summary: accent disc (by type), name + variety,
 * type, planted label, watering preference, and a status badge. Pass
 * `gardenName` in global (cross-garden) contexts.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';

import { Badge, Card, Emoji, Text } from '@components/index';
import { colors, palette, radii } from '@theme/index';
import { ACCENT_COLORS, Plant } from '../types/plant.types';
import { plantTypeMeta, statusMeta, wateringPrefMeta } from '../utils/plantLabels';
import { plantedLabel } from '../utils/plantDates';

export interface PlantCardProps {
  plant: Plant;
  onPress: () => void;
  gardenName?: string;
}

function PlantCardBase({ plant, onPress, gardenName }: PlantCardProps) {
  const meta = plantTypeMeta(plant.type);
  const accent = ACCENT_COLORS[meta.accent];
  const status = statusMeta(plant.status);
  const watering = wateringPrefMeta(plant.wateringPreference);
  const subtitle = [plant.variety, meta.label].filter(Boolean).join(' · ');

  return (
    <Card
      onPress={onPress}
      padding="sm"
      radius="lg"
      accessibilityLabel={`${plant.name}, ${meta.label}, ${status.label}`}
    >
      <View style={styles.row}>
        <LinearGradient colors={accent.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.disc}>
          <Emoji size={22}>{meta.emoji}</Emoji>
        </LinearGradient>
        <View style={styles.text}>
          <Text variant="title" color="strong" numberOfLines={1}>{plant.name}</Text>
          <Text variant="caption" color="muted" numberOfLines={1}>{subtitle}</Text>
          {gardenName ? <Text variant="caption" color="subtle" numberOfLines={1}>in {gardenName}</Text> : null}
        </View>
        <View style={styles.meta}>
          <Badge label={status.label} tone={status.tone} />
          <Text variant="caption" color="subtle">{plantedLabel(plant.plantedDate)}</Text>
        </View>
        <ChevronRight size={18} color={colors.text.subtle} />
      </View>
      <View style={styles.footer}>
        <Emoji size={13}>{watering.emoji}</Emoji>
        <Text variant="caption" color="muted">{watering.label} watering</Text>
      </View>
    </Card>
  );
}

// List item — memoized so plant lists don't re-render every row needlessly.
export const PlantCard = React.memo(PlantCardBase);

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  disc: { width: 46, height: 46, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, rowGap: 2 },
  meta: { alignItems: 'flex-end', rowGap: 4 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
  },
});

/**
 * PlantReviewCard — the final-step summary of a plant before saving.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Emoji, Text } from '@components/index';
import { colors } from '@theme/index';
import { PlantFormValues } from '../plant.schema';
import { plantSourceMeta, plantTypeMeta, sunPrefMeta, wateringPrefMeta } from '../utils/plantLabels';
import { formatPlantedDate } from '../utils/plantDates';

export interface PlantReviewCardProps {
  values: PlantFormValues;
  gardenName: string;
}

export function PlantReviewCard({ values, gardenName }: PlantReviewCardProps) {
  const type = plantTypeMeta(values.type);
  const source = plantSourceMeta(values.source);
  const sun = sunPrefMeta(values.sunPreference);
  const watering = wateringPrefMeta(values.wateringPreference);

  const rows: { label: string; value: string; emoji?: string }[] = [
    { label: 'Garden', value: gardenName || '—' },
    { label: 'Plant', value: values.name || '—' },
    { label: 'Variety', value: values.variety.trim() || 'Not set' },
    { label: 'Type', value: type.label, emoji: type.emoji },
    { label: 'Planted', value: formatPlantedDate(values.plantedDate || null) },
    { label: 'Source', value: source.label, emoji: source.emoji },
    { label: 'Location', value: values.locationInGarden.trim() || 'Not set' },
    { label: 'Sun', value: sun.label, emoji: sun.emoji },
    { label: 'Watering', value: watering.label, emoji: watering.emoji },
    { label: 'Notes', value: values.notes.trim() || 'None' },
  ];

  return (
    <Card padding="none" radius="lg">
      {rows.map((r, i) => (
        <View key={r.label}>
          <View style={styles.row}>
            <Text variant="bodySmall" color="muted">{r.label}</Text>
            <View style={styles.value}>
              {r.emoji ? <Emoji size={15}>{r.emoji}</Emoji> : null}
              <Text variant="title" color="strong" numberOfLines={1}>{r.value}</Text>
            </View>
          </View>
          {i < rows.length - 1 ? <View style={styles.divider} /> : null}
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  value: { flexDirection: 'row', alignItems: 'center', columnGap: 6, flexShrink: 1 },
  divider: { height: 1, backgroundColor: colors.border.soft, marginHorizontal: 16 },
});

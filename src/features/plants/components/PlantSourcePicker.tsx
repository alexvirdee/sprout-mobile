/**
 * PlantSourcePicker — 2-column grid of "where did this plant come from?" cards.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { Emoji, Text } from '@components/index';
import { colors, palette, radii } from '@theme/index';
import { ACCENT_COLORS, PLANT_SOURCE_OPTIONS, PlantSource } from '../types/plant.types';

export interface PlantSourcePickerProps {
  value: PlantSource;
  onChange: (value: PlantSource) => void;
}

export function PlantSourcePicker({ value, onChange }: PlantSourcePickerProps) {
  return (
    <View style={styles.grid}>
      {PLANT_SOURCE_OPTIONS.map((opt) => {
        const active = opt.value === value;
        const accent = ACCENT_COLORS[opt.accent];
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.label}
            onPress={() => onChange(opt.value)}
            style={[styles.card, active && styles.cardActive]}
          >
            <View style={[styles.disc, { backgroundColor: accent.soft }]}>
              <Emoji size={18}>{opt.emoji}</Emoji>
            </View>
            <Text variant="label" color={active ? 'strong' : 'body'} numberOfLines={1} style={styles.label}>
              {opt.label}
            </Text>
            {active ? (
              <View style={styles.check}>
                <Check size={12} color="#fff" strokeWidth={3} />
              </View>
            ) : null}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    width: '47%',
    flexGrow: 1,
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.surface.card,
    borderWidth: 1.5,
    borderColor: colors.border.soft,
    borderRadius: radii.md,
  },
  cardActive: { borderColor: palette.green[400], backgroundColor: palette.green[50] },
  disc: { width: 34, height: 34, borderRadius: radii.sm, alignItems: 'center', justifyContent: 'center' },
  label: { flex: 1 },
  check: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: palette.green[500],
    alignItems: 'center',
    justifyContent: 'center',
  },
});

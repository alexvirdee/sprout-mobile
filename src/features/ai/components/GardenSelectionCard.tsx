/**
 * GardenSelectionCard — choose which garden to add the scanned plant to. Shows a
 * friendly empty state with a "Create Garden" CTA when the user has none.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check } from 'lucide-react-native';

import { Button, Emoji, Skeleton, Text } from '@components/index';
import { colors, palette, radii } from '@theme/index';
import { ACCENT_COLORS, Garden, gardenTypeMeta } from '@features/gardens/types/garden.types';

export interface GardenSelectionCardProps {
  gardens: Garden[];
  selectedId: string;
  onSelect: (gardenId: string) => void;
  onCreateGarden: () => void;
  loading?: boolean;
}

export function GardenSelectionCard({ gardens, selectedId, onSelect, onCreateGarden, loading }: GardenSelectionCardProps) {
  if (loading) {
    return (
      <View style={styles.list}>
        <Skeleton height={64} radius={radii.lg} />
        <Skeleton height={64} radius={radii.lg} />
      </View>
    );
  }

  if (gardens.length === 0) {
    return (
      <View style={styles.empty}>
        <Emoji size={32}>🪴</Emoji>
        <Text variant="h3" color="strong" align="center" style={styles.emptyTitle}>
          No gardens yet
        </Text>
        <Text variant="bodySmall" color="muted" align="center">
          Create a garden first, then Sprout can add this plant to it.
        </Text>
        <Button label="Create Garden" onPress={onCreateGarden} style={styles.emptyCta} />
      </View>
    );
  }

  return (
    <View style={styles.list}>
      {gardens.map((g) => {
        const meta = gardenTypeMeta(g.type);
        const active = g.id === selectedId;
        return (
          <Pressable
            key={g.id}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(g.id)}
            style={[styles.row, active && styles.rowActive]}
          >
            <LinearGradient colors={ACCENT_COLORS[meta.accent].grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.disc}>
              <Emoji size={20}>{meta.emoji}</Emoji>
            </LinearGradient>
            <View style={styles.flex}>
              <Text variant="title" color="strong" numberOfLines={1}>
                {g.name}
              </Text>
              <Text variant="caption" color="muted">
                {meta.label} · {g.plantCount} plants
              </Text>
            </View>
            <View style={[styles.radio, active && styles.radioActive]}>
              {active ? <Check size={13} color="#fff" strokeWidth={3} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { rowGap: 10 },
  empty: { alignItems: 'center', paddingVertical: 24, rowGap: 6 },
  emptyTitle: { marginTop: 4 },
  emptyCta: { marginTop: 16 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    padding: 12,
    backgroundColor: colors.surface.card,
    borderWidth: 1.5,
    borderColor: colors.border.soft,
    borderRadius: radii.lg,
  },
  rowActive: { borderColor: palette.green[400], backgroundColor: palette.green[50] },
  disc: { width: 44, height: 44, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  flex: { flex: 1 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: palette.green[500], backgroundColor: palette.green[500] },
});

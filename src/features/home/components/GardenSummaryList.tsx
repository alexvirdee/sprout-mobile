/**
 * GardenSummaryList — compact, tappable garden rows for the Home overview
 * (accent disc, name, type · plant count, health badge). Real garden data.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';

import { Badge, Card, Emoji, Text } from '@components/index';
import { colors, radii } from '@theme/index';
import { ACCENT_COLORS, Garden, gardenTypeMeta } from '@features/gardens/types/garden.types';

export interface GardenSummaryListProps {
  gardens: Garden[];
  onPressGarden: (id: string) => void;
}

export function GardenSummaryList({ gardens, onPressGarden }: GardenSummaryListProps) {
  return (
    <View style={styles.list}>
      {gardens.map((g) => {
        const meta = gardenTypeMeta(g.type);
        const accent = ACCENT_COLORS[meta.accent];
        return (
          <Card key={g.id} onPress={() => onPressGarden(g.id)} padding="sm" radius="lg">
            <View style={styles.row}>
              <LinearGradient colors={accent.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.disc}>
                <Emoji size={20}>{meta.emoji}</Emoji>
              </LinearGradient>
              <View style={styles.text}>
                <Text variant="title" color="strong" numberOfLines={1}>{g.name}</Text>
                <Text variant="caption" color="muted" numberOfLines={1}>{meta.label} · {g.plantCount} plants</Text>
              </View>
              <Badge label={g.healthStatus} tone="sage" />
              <ChevronRight size={18} color={colors.text.subtle} />
            </View>
          </Card>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { rowGap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  disc: { width: 44, height: 44, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, rowGap: 2 },
});

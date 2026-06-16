/**
 * GardenSummaryList — compact, tappable garden rows for Home: accent disc, name,
 * type · plant count, last-watered, live weather (when the garden has saved
 * coordinates), and a health badge. Each row is its own component so it can run
 * the weather query at the top level (hooks can't live in a map).
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';

import { Badge, Card, Emoji, Text } from '@components/index';
import { colors, radii } from '@theme/index';
import { ACCENT_COLORS, Garden, gardenTypeMeta } from '@features/gardens/types/garden.types';
import { lastWateredLabel } from '@features/watering/utils/hydrationStatus';
import { useCurrentWeather } from '@features/weather/hooks/useCurrentWeather';

export interface GardenSummaryListProps {
  gardens: Garden[];
  onPressGarden: (id: string) => void;
}

function GardenSummaryRow({ garden, onPress }: { garden: Garden; onPress: () => void }) {
  const meta = gardenTypeMeta(garden.type);
  const accent = ACCENT_COLORS[meta.accent];
  const coords =
    garden.latitude != null && garden.longitude != null
      ? { latitude: garden.latitude, longitude: garden.longitude }
      : null;
  const { data: weather } = useCurrentWeather(coords);

  return (
    <Card onPress={onPress} padding="sm" radius="lg">
      <View style={styles.row}>
        <LinearGradient colors={accent.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.disc}>
          <Emoji size={20}>{meta.emoji}</Emoji>
        </LinearGradient>
        <View style={styles.text}>
          <Text variant="title" color="strong" numberOfLines={1}>
            {garden.name}
          </Text>
          <Text variant="caption" color="muted" numberOfLines={1}>
            {meta.label} · {garden.plantCount} {garden.plantCount === 1 ? 'plant' : 'plants'}
          </Text>
          <Text variant="caption" color="subtle" numberOfLines={1}>
            💧 {lastWateredLabel(garden.lastWateredAt)}
          </Text>
        </View>
        <View style={styles.meta}>
          {weather ? (
            <View style={styles.weather}>
              <Emoji size={13}>{weather.emoji}</Emoji>
              <Text variant="caption" color="muted">
                {weather.temperature}°
              </Text>
            </View>
          ) : null}
          <Badge label={garden.healthStatus} tone="sage" />
          <ChevronRight size={18} color={colors.text.subtle} />
        </View>
      </View>
    </Card>
  );
}

export function GardenSummaryList({ gardens, onPressGarden }: GardenSummaryListProps) {
  return (
    <View style={styles.list}>
      {gardens.map((g) => (
        <GardenSummaryRow key={g.id} garden={g} onPress={() => onPressGarden(g.id)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { rowGap: 10 },
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  disc: { width: 46, height: 46, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, rowGap: 2 },
  meta: { alignItems: 'flex-end', rowGap: 5 },
  weather: { flexDirection: 'row', alignItems: 'center', columnGap: 3 },
});

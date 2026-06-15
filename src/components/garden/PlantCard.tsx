/**
 * PlantCard — plant tile for "My Garden" grids: gradient/photo header, status
 * pill, name, location, and an optional growth progress bar.
 */

import React from 'react';
import { Image, Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { colors, gradients, palette, radii, shadows } from '@theme/index';
import { Text } from '../ui/Text';
import { Badge, BadgeTone } from '../ui/Badge';

export type PlantStatus = 'thriving' | 'water' | 'harvest' | 'resting';

const STATUS: Record<PlantStatus, { tone: BadgeTone; label: string }> = {
  thriving: { tone: 'green', label: 'Thriving' },
  water: { tone: 'terra', label: 'Needs water' },
  harvest: { tone: 'gold', label: 'Harvest ready' },
  resting: { tone: 'sage', label: 'Resting' },
};

export interface PlantCardProps {
  name: string;
  variety?: string;
  location?: string;
  image?: string;
  emoji?: string;
  status?: PlantStatus;
  progress?: number;
  onPress?: () => void;
  style?: ViewStyle;
}

export function PlantCard({
  name,
  variety,
  location,
  image,
  emoji = '🌱',
  status = 'thriving',
  progress,
  onPress,
  style,
}: PlantCardProps) {
  const st = STATUS[status];
  const meta = [variety, location].filter(Boolean).join(' · ');

  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={({ pressed }): ViewStyle => ({
        ...styles.card,
        ...(pressed && onPress ? { transform: [{ scale: 0.98 }], ...shadows.md } : {}),
        ...style,
      })}
    >
      <View style={styles.header}>
        {image ? (
          <Image source={{ uri: image }} style={StyleSheet.absoluteFill} resizeMode="cover" />
        ) : (
          <LinearGradient
            colors={gradients.meadow.colors}
            start={gradients.meadow.start}
            end={gradients.meadow.end}
            style={StyleSheet.absoluteFill}
          />
        )}
        {!image ? <Text style={styles.emoji}>{emoji}</Text> : null}
        <View style={styles.badge}>
          <Badge label={st.label} tone={st.tone} dot />
        </View>
      </View>

      <View style={styles.body}>
        <Text variant="h3" color="strong" numberOfLines={1}>
          {name}
        </Text>
        {meta ? (
          <Text variant="bodySmall" color="muted" numberOfLines={1} style={styles.meta}>
            {meta}
          </Text>
        ) : null}

        {progress != null ? (
          <View style={styles.track}>
            <LinearGradient
              colors={gradients.leaf.colors}
              start={gradients.leaf.start}
              end={gradients.leaf.end}
              style={[styles.fill, { width: `${Math.min(100, progress)}%` }]}
            />
          </View>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.soft,
    borderRadius: radii.xl,
    overflow: 'hidden',
    ...shadows.sm,
  },
  header: {
    height: 132,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: { fontSize: 52 },
  badge: { position: 'absolute', top: 12, left: 12 },
  body: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 16 },
  meta: { marginTop: 3 },
  track: {
    marginTop: 12,
    height: 7,
    borderRadius: radii.pill,
    backgroundColor: palette.neutral[150],
    overflow: 'hidden',
  },
  fill: { height: '100%', borderRadius: radii.pill },
});

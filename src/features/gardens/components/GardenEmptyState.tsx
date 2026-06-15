/**
 * GardenEmptyState — the warm "no gardens yet" state with a soft illustration
 * disc, encouraging copy, a primary CTA, and a reassuring secondary line.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';

import { Button, Emoji, Text } from '@components/index';
import { gradients, shadows, spacing } from '@theme/index';

export interface GardenEmptyStateProps {
  onCreate: () => void;
}

export function GardenEmptyState({ onCreate }: GardenEmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={gradients.meadow.colors}
        start={gradients.meadow.start}
        end={gradients.meadow.end}
        style={[styles.disc, shadows.xs]}
      >
        <Emoji size={48}>🌱</Emoji>
      </LinearGradient>

      <Text variant="h1" color="strong" align="center" style={styles.title}>
        Start your first garden
      </Text>
      <Text variant="body" color="muted" align="center" style={styles.message}>
        Create a garden to track plants, beds, watering, harvests, and seasonal progress.
      </Text>

      <Button
        label="Create garden"
        size="lg"
        onPress={onCreate}
        iconLeft={<Plus size={18} color="#fff" />}
        style={styles.cta}
      />

      <Text variant="caption" color="subtle" align="center" style={styles.subtle}>
        You can add plants after your garden is set up.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingHorizontal: spacing.xl, paddingTop: spacing['3xl'], maxWidth: 400, alignSelf: 'center' },
  disc: {
    width: 104,
    height: 104,
    borderTopLeftRadius: 64,
    borderTopRightRadius: 40,
    borderBottomLeftRadius: 46,
    borderBottomRightRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  title: { marginBottom: spacing.sm },
  message: { marginBottom: spacing.xl },
  cta: { alignSelf: 'stretch' },
  subtle: { marginTop: spacing.base },
});

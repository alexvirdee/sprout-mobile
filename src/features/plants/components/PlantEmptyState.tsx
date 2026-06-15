/**
 * PlantEmptyState — reusable warm empty state (soft disc + copy + CTA). Used for
 * "no plants yet" in a garden and "create a garden first" in the add flow.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';

import { Button, Emoji, Text } from '@components/index';
import { gradients, shadows, spacing } from '@theme/index';

export interface PlantEmptyStateProps {
  emoji?: string;
  title: string;
  body: string;
  ctaLabel: string;
  onCta: () => void;
}

export function PlantEmptyState({ emoji = '🌱', title, body, ctaLabel, onCta }: PlantEmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={gradients.meadow.colors}
        start={gradients.meadow.start}
        end={gradients.meadow.end}
        style={[styles.disc, shadows.xs]}
      >
        <Emoji size={40}>{emoji}</Emoji>
      </LinearGradient>
      <Text variant="h2" color="strong" align="center" style={styles.title}>{title}</Text>
      <Text variant="bodySmall" color="muted" align="center" style={styles.body}>{body}</Text>
      <Button label={ctaLabel} onPress={onCta} iconLeft={<Plus size={18} color="#fff" />} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing.lg, paddingHorizontal: spacing.base },
  disc: {
    width: 84,
    height: 84,
    borderTopLeftRadius: 52,
    borderTopRightRadius: 32,
    borderBottomLeftRadius: 36,
    borderBottomRightRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.base,
  },
  title: { marginBottom: spacing.xs },
  body: { marginBottom: spacing.lg },
});

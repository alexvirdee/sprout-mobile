/**
 * HomeEmptyState — warm first-run state when the user has no gardens. Explains
 * that weather + daily care get personal once a garden exists.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';

import { Button, Emoji, Text } from '@components/index';
import { gradients, shadows, spacing } from '@theme/index';

export interface HomeEmptyStateProps {
  onCreate: () => void;
}

export function HomeEmptyState({ onCreate }: HomeEmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={gradients.meadow.colors}
        start={gradients.meadow.start}
        end={gradients.meadow.end}
        style={[styles.disc, shadows.xs]}
      >
        <Emoji size={44}>🌱</Emoji>
      </LinearGradient>

      <Text variant="h1" color="strong" align="center" style={styles.title}>
        Plant your first garden
      </Text>
      <Text variant="body" color="muted" align="center" style={styles.message}>
        Create a garden and Sprout's weather and daily care tips become personal
        to your growing space.
      </Text>

      <Button
        label="Create your first garden"
        size="lg"
        onPress={onCreate}
        iconLeft={<Plus size={18} color="#fff" />}
        style={styles.cta}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingTop: spacing.xl, paddingHorizontal: spacing.sm },
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
});

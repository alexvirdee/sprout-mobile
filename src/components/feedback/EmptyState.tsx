/**
 * EmptyState — friendly "nothing here yet" with a soft illustration disc,
 * an encouraging message, and an optional action. Voice stays warm:
 * "Your garden is waiting. Add your first plant…".
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { gradients, shadows, spacing } from '@theme/index';
import { Text } from '../ui/Text';
import { Emoji } from '../ui/Emoji';

export interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon = '🌱', title, message, action }: EmptyStateProps) {
  return (
    <View style={styles.wrap}>
      <LinearGradient
        colors={gradients.meadow.colors}
        start={gradients.meadow.start}
        end={gradients.meadow.end}
        style={[styles.disc, shadows.xs]}
      >
        <Emoji size={44}>{icon}</Emoji>
      </LinearGradient>
      <Text variant="h2" color="strong" align="center">
        {title}
      </Text>
      {message ? (
        <Text variant="body" color="muted" align="center" style={styles.message}>
          {message}
        </Text>
      ) : null}
      {action ? <View style={styles.action}>{action}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    paddingVertical: spacing['3xl'],
    paddingHorizontal: spacing.xl,
    maxWidth: 380,
    alignSelf: 'center',
  },
  disc: {
    width: 96,
    height: 96,
    // organic blob-ish corners
    borderTopLeftRadius: 60,
    borderTopRightRadius: 38,
    borderBottomLeftRadius: 42,
    borderBottomRightRadius: 58,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  message: { marginTop: 8 },
  action: { marginTop: spacing.xl },
});

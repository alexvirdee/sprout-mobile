/**
 * Loading states — a centered Spinner for whole-screen waits and a Skeleton
 * block for content placeholders (gentle pulse, never a harsh shimmer).
 */

import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, palette, radii, spacing } from '@theme/index';
import { Text } from '../ui/Text';

export function Spinner({ label }: { label?: string }) {
  return (
    <View style={styles.spinner}>
      <ActivityIndicator size="large" color={colors.action.primary} />
      {label ? (
        <Text variant="body" color="muted" style={styles.spinnerLabel}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

export interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  radius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, radius = radii.sm, style }: SkeletonProps) {
  const pulse = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.5, duration: 700, useNativeDriver: true }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [pulse]);

  return (
    <Animated.View
      style={[
        { width, height, borderRadius: radius, backgroundColor: palette.neutral[150], opacity: pulse },
        style,
      ]}
    />
  );
}

/** A pre-composed card-shaped skeleton, handy for list/grid placeholders. */
export function SkeletonCard() {
  return (
    <View style={styles.card}>
      <Skeleton height={120} radius={radii.md} />
      <Skeleton width="70%" height={16} style={{ marginTop: spacing.base }} />
      <Skeleton width="45%" height={12} style={{ marginTop: spacing.sm }} />
    </View>
  );
}

const styles = StyleSheet.create({
  spinner: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: spacing.xl },
  spinnerLabel: { marginTop: spacing.base },
  card: {
    backgroundColor: colors.surface.card,
    borderColor: colors.border.soft,
    borderWidth: 1,
    borderRadius: radii.lg,
    padding: spacing.base,
  },
});

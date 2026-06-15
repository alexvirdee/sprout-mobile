/**
 * FlashBanner — a small success banner that fades in and auto-dismisses. Driven
 * by a navigation `flash` param so create/update/archive can confirm an action
 * on the destination screen.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { CircleCheck } from 'lucide-react-native';

import { Text } from '@components/index';
import { palette, radii, shadows } from '@theme/index';

export interface FlashBannerProps {
  message?: string;
  onDone: () => void;
  duration?: number;
}

export function FlashBanner({ message, onDone, duration = 2600 }: FlashBannerProps) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!message) return;
    Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    const t = setTimeout(() => {
      Animated.timing(opacity, { toValue: 0, duration: 200, useNativeDriver: true }).start(({ finished }) => {
        if (finished) onDone();
      });
    }, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDone, opacity]);

  if (!message) return null;

  return (
    <Animated.View style={[styles.banner, { opacity }]} accessibilityLiveRegion="polite">
      <CircleCheck size={18} color={palette.green[700]} />
      <Text variant="label" tint={palette.green[800]} style={styles.label}>
        {message}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: radii.md,
    backgroundColor: palette.green[100],
    borderWidth: 1,
    borderColor: palette.green[200],
    ...shadows.sm,
  },
  label: { flex: 1 },
});

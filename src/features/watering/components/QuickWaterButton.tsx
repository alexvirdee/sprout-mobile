/**
 * QuickWaterButton — the heart of the <5s watering flow. One tap: a success
 * haptic fires, the button pops with a spring, and it flashes "Watered!" before
 * settling into a calm "watered" state. No modal, no confirm. Reused on garden
 * and plant cards.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, ViewStyle } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Check, Droplet } from 'lucide-react-native';

import { Text } from '@components/index';
import { colors, palette, radii, shadows } from '@theme/index';

const SUCCESS_MS = 1600;

const SIZES = {
  sm: { h: 38, px: 14, font: 14, icon: 16 },
  md: { h: 46, px: 18, font: 15, icon: 18 },
} as const;

export interface QuickWaterButtonProps {
  onWater: () => void;
  /** True when the target was already watered today (calm, settled state). */
  watered?: boolean;
  size?: keyof typeof SIZES;
  style?: ViewStyle;
}

export function QuickWaterButton({ onWater, watered = false, size = 'md', style }: QuickWaterButtonProps) {
  const [justWatered, setJustWatered] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dims = SIZES[size];

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    []
  );

  const handlePress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
    setJustWatered(true);
    Animated.sequence([
      Animated.spring(scale, { toValue: 1.12, useNativeDriver: true, speed: 50, bounciness: 16 }),
      Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 40, bounciness: 8 }),
    ]).start();
    onWater();
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setJustWatered(false), SUCCESS_MS);
  };

  const done = justWatered || watered;
  const label = justWatered ? 'Watered!' : watered ? 'Watered today' : 'Water';

  return (
    <Animated.View style={{ transform: [{ scale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={done ? 'Watered' : 'Water now'}
        onPress={handlePress}
        style={[
          styles.btn,
          { height: dims.h, paddingHorizontal: dims.px },
          done ? styles.done : styles.active,
          !done ? shadows.brand : null,
          style,
        ]}
      >
        {done ? (
          <Check size={dims.icon} color={palette.green[700]} strokeWidth={2.6} />
        ) : (
          <Droplet size={dims.icon} color="#FFFFFF" fill="#FFFFFF" />
        )}
        <Text variant="label" tint={done ? palette.green[700] : '#FFFFFF'} style={{ fontSize: dims.font }}>
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: 7,
    borderRadius: radii.pill,
    borderWidth: 1,
  },
  active: { backgroundColor: colors.action.primary, borderColor: 'transparent' },
  done: { backgroundColor: palette.green[50], borderColor: palette.green[200] },
});

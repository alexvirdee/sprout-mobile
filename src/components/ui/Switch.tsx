/**
 * Switch — toggle for reminders, settings, notifications. The knob slides with
 * a gentle spring, matching the design system's playful affordance easing.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Pressable, StyleSheet, View } from 'react-native';

import { colors, palette, radii, shadows } from '@theme/index';
import { Text } from './Text';

type Size = 'sm' | 'md';

const DIMS: Record<Size, { w: number; h: number; k: number }> = {
  sm: { w: 40, h: 24, k: 18 },
  md: { w: 50, h: 30, k: 24 },
};

export interface SwitchProps {
  value: boolean;
  onValueChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: Size;
}

export function Switch({ value, onValueChange, label, disabled = false, size = 'md' }: SwitchProps) {
  const { w, h, k } = DIMS[size];
  const pad = (h - k) / 2;
  const anim = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: value ? 1 : 0,
      useNativeDriver: false,
      friction: 7,
      tension: 90,
    }).start();
  }, [value, anim]);

  const translateX = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [pad, w - k - pad],
  });

  const backgroundColor = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [palette.neutral[300], colors.action.primary],
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={[styles.row, disabled && styles.disabled]}
    >
      <Animated.View style={[styles.track, { width: w, height: h, borderRadius: radii.pill, backgroundColor }]}>
        <Animated.View
          style={[
            styles.knob,
            { width: k, height: k, borderRadius: k / 2, transform: [{ translateX }] },
            shadows.sm,
          ]}
        />
      </Animated.View>
      {label ? (
        <Text variant="body" color="strong" style={styles.label}>
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  disabled: { opacity: 0.5 },
  track: { justifyContent: 'center' },
  knob: { position: 'absolute', backgroundColor: '#fff' },
  label: { fontFamily: 'HankenGrotesk_500Medium' },
});

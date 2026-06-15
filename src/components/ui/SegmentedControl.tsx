/**
 * SegmentedControl — pill filter row / view switch. Used on My Garden ("All ·
 * Veg · Herbs · Flowers") and time-range toggles.
 */

import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, palette, radii, shadows } from '@theme/index';
import { Text } from './Text';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: string;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'md',
  style,
}: SegmentedControlProps<T>) {
  const h = size === 'sm' ? 36 : 44;
  return (
    <View style={[styles.container, style]}>
      {options.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onChange(opt.value)}
            style={[
              styles.segment,
              { height: h },
              active && styles.segmentActive,
            ]}
          >
            <Text
              variant="label"
              tint={active ? palette.green[800] : colors.text.muted}
              style={{ fontSize: size === 'sm' ? 13.5 : 14.5 }}
            >
              {opt.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 4,
    columnGap: 2,
    backgroundColor: colors.surface.muted,
    borderRadius: radii.pill,
  },
  segment: {
    paddingHorizontal: 18,
    borderRadius: radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.surface.card,
    ...shadows.sm,
  },
});

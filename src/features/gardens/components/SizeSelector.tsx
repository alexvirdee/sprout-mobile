/**
 * SizeSelector — full-width selectable rows for garden size (label + hint +
 * radio). When "Custom" is chosen, the form reveals optional dimension inputs.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { Emoji, Text } from '@components/index';
import { colors, palette, radii } from '@theme/index';
import { SIZE_TYPE_OPTIONS, SizeType } from '../types/garden.types';

export interface SizeSelectorProps {
  value: SizeType;
  onChange: (value: SizeType) => void;
}

export function SizeSelector({ value, onChange }: SizeSelectorProps) {
  return (
    <View style={styles.list}>
      {SIZE_TYPE_OPTIONS.map((opt) => {
        const active = opt.value === value;
        return (
          <Pressable
            key={opt.value}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            accessibilityLabel={opt.label}
            onPress={() => onChange(opt.value)}
            style={[styles.row, active && styles.rowActive]}
          >
            <Emoji size={22}>{opt.emoji}</Emoji>
            <View style={styles.text}>
              <Text variant="title" color="strong">{opt.label}</Text>
              {opt.hint ? <Text variant="caption" color="muted">{opt.hint}</Text> : null}
            </View>
            <View style={[styles.radio, active && styles.radioActive]}>
              {active ? <Check size={13} color="#fff" strokeWidth={3} /> : null}
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { rowGap: 10 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 14,
    minHeight: 56,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.surface.card,
    borderWidth: 1.5,
    borderColor: colors.border.soft,
    borderRadius: radii.md,
  },
  rowActive: { borderColor: palette.green[400], backgroundColor: palette.green[50] },
  text: { flex: 1, rowGap: 1 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: palette.green[500], backgroundColor: palette.green[500] },
});

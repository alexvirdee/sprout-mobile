/**
 * Checkbox — styled for Sprout's garden task lists. Checking a task strikes
 * the label through (a quiet, rewarding "done").
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { colors, radii } from '@theme/index';
import { Text } from './Text';

export interface CheckboxProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Checkbox({ checked, onChange, label, disabled = false }: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      style={[styles.row, disabled && styles.disabled]}
      hitSlop={6}
    >
      <View
        style={[
          styles.box,
          {
            backgroundColor: checked ? colors.action.primary : colors.surface.card,
            borderColor: checked ? colors.action.primary : colors.border.strong,
          },
        ]}
      >
        {checked ? <Check size={15} color="#fff" strokeWidth={3.4} /> : null}
      </View>
      {label ? (
        <Text
          variant="body"
          color={checked ? 'muted' : 'strong'}
          style={checked ? styles.struck : undefined}
        >
          {label}
        </Text>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 11 },
  disabled: { opacity: 0.5 },
  box: {
    width: 24,
    height: 24,
    borderRadius: radii.xs,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  struck: { textDecorationLine: 'line-through' },
});

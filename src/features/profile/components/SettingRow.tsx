/**
 * SettingRow — one row in a settings card: icon chip, label (+ optional hint),
 * and either a trailing value, a control (e.g. a Switch), or a chevron. Pass
 * `onPress` to make it tappable; `danger` tints the label for destructive rows.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { Text } from '@components/index';
import { colors, radii } from '@theme/index';

export interface SettingRowProps {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  value?: string;
  control?: React.ReactNode;
  onPress?: () => void;
  danger?: boolean;
}

export function SettingRow({ icon, label, hint, value, control, onPress, danger }: SettingRowProps) {
  const showChevron = !!onPress && !control && !value;

  const body = (
    <View style={styles.row}>
      <View style={styles.icon}>{icon}</View>
      <View style={styles.text}>
        <Text variant="title" color={danger ? 'danger' : 'strong'}>
          {label}
        </Text>
        {hint ? (
          <Text variant="caption" color="muted" style={styles.hint}>
            {hint}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text variant="bodySmall" color="muted" style={styles.value}>
          {value}
        </Text>
      ) : null}
      {control ?? (showChevron ? <ChevronRight size={20} color={colors.text.subtle} /> : null)}
    </View>
  );

  if (control || !onPress) return body;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.pressed : undefined)}
    >
      {body}
    </Pressable>
  );
}

export function SettingDivider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 14, paddingHorizontal: 16, paddingVertical: 15 },
  icon: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    backgroundColor: colors.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, rowGap: 2 },
  hint: { marginTop: 1 },
  value: { marginRight: 6 },
  pressed: { backgroundColor: colors.surface.sunken },
  divider: { height: 1, backgroundColor: colors.border.soft, marginLeft: 64 },
});

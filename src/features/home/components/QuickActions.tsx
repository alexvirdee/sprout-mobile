/**
 * QuickActions — playful 2×2 grid of common actions. "Add garden" is wired;
 * the rest are Phase-2 placeholders that show a friendly "coming soon" message.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Droplets, Pencil, Plus, Sprout } from 'lucide-react-native';

import { SectionHeader, Text } from '@components/index';
import { colors, palette, radii, shadows } from '@theme/index';

export interface QuickActionsProps {
  onAddGarden: () => void;
  onAddPlant: () => void;
  onComingSoon: (label: string) => void;
}

export function QuickActions({ onAddGarden, onAddPlant, onComingSoon }: QuickActionsProps) {
  const actions = [
    { key: 'garden', label: 'Add garden', icon: <Plus size={20} color={palette.green[700]} />, soft: palette.green[50], onPress: onAddGarden },
    { key: 'plant', label: 'Add plant', icon: <Sprout size={20} color={palette.sageScale[700]} />, soft: palette.sageScale[50], onPress: onAddPlant },
    { key: 'water', label: 'Log watering', icon: <Droplets size={20} color={palette.terra[600]} />, soft: palette.terra[50], onPress: () => onComingSoon('Watering log') },
    { key: 'note', label: 'Add note', icon: <Pencil size={20} color={palette.gold[700]} />, soft: palette.gold[50], onPress: () => onComingSoon('Notes') },
  ];

  return (
    <View>
      <SectionHeader title="Quick actions" />
      <View style={styles.grid}>
        {actions.map((a) => (
          <Pressable
            key={a.key}
            accessibilityRole="button"
            accessibilityLabel={a.label}
            onPress={a.onPress}
            style={({ pressed }) => [styles.action, pressed && styles.pressed]}
          >
            <View style={[styles.chip, { backgroundColor: a.soft }]}>{a.icon}</View>
            <Text variant="label" color="strong">{a.label}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  action: {
    width: '47%',
    flexGrow: 1,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.soft,
    borderRadius: radii.lg,
    ...shadows.sm,
  },
  pressed: { backgroundColor: colors.surface.sunken },
  chip: { width: 38, height: 38, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
});

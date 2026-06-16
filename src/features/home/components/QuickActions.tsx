/**
 * QuickActions — a touch-friendly 2×2 grid of the most common next steps, sitting
 * right under the weather. One tap each. Matches the Sprout card aesthetic.
 */

import React from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { Camera, Droplets, Plus, Sprout } from 'lucide-react-native';

import { SectionHeader, Text } from '@components/index';
import { colors, palette, radii, shadows } from '@theme/index';

export interface QuickActionsProps {
  onScan: () => void;
  onAddPlant: () => void;
  onWater: () => void;
  onCreateGarden: () => void;
}

export function QuickActions({ onScan, onAddPlant, onWater, onCreateGarden }: QuickActionsProps) {
  const actions = [
    { key: 'scan', label: 'Scan Plant', icon: <Camera size={20} color={palette.green[700]} />, soft: palette.green[50], onPress: onScan },
    { key: 'plant', label: 'Add Plant', icon: <Sprout size={20} color={palette.sageScale[700]} />, soft: palette.sageScale[50], onPress: onAddPlant },
    { key: 'water', label: 'Water Garden', icon: <Droplets size={20} color={colors.status.info} />, soft: colors.status.infoSoft, onPress: onWater },
    { key: 'garden', label: 'New Garden', icon: <Plus size={20} color={palette.gold[700]} />, soft: palette.gold[50], onPress: onCreateGarden },
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
            style={({ pressed }): ViewStyle => ({
              ...styles.action,
              ...(pressed ? styles.pressed : {}),
              transform: [{ scale: pressed ? 0.97 : 1 }],
            })}
          >
            <View style={[styles.chip, { backgroundColor: a.soft }]}>{a.icon}</View>
            <Text variant="label" color="strong">
              {a.label}
            </Text>
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
    paddingVertical: 16,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.soft,
    borderRadius: radii.lg,
    ...shadows.sm,
  },
  pressed: { backgroundColor: colors.surface.sunken },
  chip: { width: 40, height: 40, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
});

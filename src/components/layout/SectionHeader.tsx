/**
 * SectionHeader — title with an optional trailing action ("See all"). Matches
 * the dashboard's section rhythm.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { palette } from '@theme/index';
import { Text } from '../ui/Text';

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionPress?: () => void;
}

export function SectionHeader({ title, actionLabel, onActionPress }: SectionHeaderProps) {
  return (
    <View style={styles.row}>
      <Text variant="h3" color="strong">
        {title}
      </Text>
      {actionLabel ? (
        <Pressable accessibilityRole="button" onPress={onActionPress} hitSlop={8}>
          <Text variant="label" tint={palette.green[700]}>
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
});

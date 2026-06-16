/**
 * CareSuggestionCard — a suggested reminder with a toggle + frequency. Used in
 * the "Set up care reminders?" flow.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Emoji, Switch, Text } from '@components/index';
import { colors, radii } from '@theme/index';
import { CareSuggestion } from '../types/care.types';
import { taskTypeMeta } from '../utils/careTaskLabels';

export interface CareSuggestionCardProps {
  suggestion: CareSuggestion;
  selected: boolean;
  onToggle: () => void;
}

export function CareSuggestionCard({ suggestion, selected, onToggle }: CareSuggestionCardProps) {
  const meta = taskTypeMeta(suggestion.taskType);
  return (
    <Card padding="sm" radius="lg">
      <View style={styles.row}>
        <View style={styles.chip}>
          <Emoji size={20}>{meta.emoji}</Emoji>
        </View>
        <View style={styles.text}>
          <Text variant="title" color="strong" numberOfLines={1}>
            {suggestion.title}
          </Text>
          <Text variant="caption" color="muted">
            {suggestion.detail}
          </Text>
        </View>
        <Switch value={selected} onValueChange={onToggle} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  chip: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, rowGap: 2 },
});

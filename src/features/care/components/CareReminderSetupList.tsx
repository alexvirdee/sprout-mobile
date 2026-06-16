/**
 * CareReminderSetupList — the list of suggested reminders with per-item toggles.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CareSuggestion } from '../types/care.types';
import { CareSuggestionCard } from './CareSuggestionCard';

export interface CareReminderSetupListProps {
  suggestions: CareSuggestion[];
  selectedKeys: string[];
  onToggle: (key: string) => void;
}

export function CareReminderSetupList({ suggestions, selectedKeys, onToggle }: CareReminderSetupListProps) {
  return (
    <View style={styles.list}>
      {suggestions.map((s) => (
        <CareSuggestionCard
          key={s.key}
          suggestion={s}
          selected={selectedKeys.includes(s.key)}
          onToggle={() => onToggle(s.key)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ list: { rowGap: 10 } });

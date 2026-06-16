/**
 * JournalTimeline — a compact, mapped list of entries for embedding in other
 * screens (e.g. the top few on Garden/Plant detail). The full-screen journal
 * uses a FlatList directly for virtualization.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { JournalEntry } from '../types/journal.types';
import { JournalEntryCard } from './JournalEntryCard';

export interface JournalTimelineProps {
  entries: JournalEntry[];
  onEntryPress?: (entry: JournalEntry) => void;
  onEntryLongPress?: (entry: JournalEntry) => void;
}

export function JournalTimeline({ entries, onEntryPress, onEntryLongPress }: JournalTimelineProps) {
  return (
    <View style={styles.list}>
      {entries.map((entry) => (
        <JournalEntryCard
          key={entry.id}
          entry={entry}
          onPress={onEntryPress ? () => onEntryPress(entry) : undefined}
          onLongPress={onEntryLongPress ? () => onEntryLongPress(entry) : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ list: { rowGap: 10 } });

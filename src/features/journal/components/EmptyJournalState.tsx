/**
 * EmptyJournalState — warm empty state for a garden/plant with no entries yet.
 */

import React from 'react';

import { Button, EmptyState } from '@components/index';

export interface EmptyJournalStateProps {
  onAdd: () => void;
}

export function EmptyJournalState({ onAdd }: EmptyJournalStateProps) {
  return (
    <EmptyState
      icon="🧺"
      title="No journal entries yet"
      message="Log your first harvest, jot a note, or mark a milestone — your garden's story starts here."
      action={<Button label="Log a harvest" onPress={onAdd} />}
    />
  );
}

/**
 * EmptyCareState — encouraging empty states for the care views.
 */

import React from 'react';

import { Button, EmptyState } from '@components/index';

export interface EmptyCareStateProps {
  variant: 'no-tasks' | 'no-plants';
  onAction?: () => void;
}

export function EmptyCareState({ variant, onAction }: EmptyCareStateProps) {
  if (variant === 'no-plants') {
    return (
      <EmptyState
        icon="🪴"
        title="Add your first plant"
        message="Sprout can suggest watering, pruning, and care reminders once you've added plants."
        action={onAction ? <Button label="Add Plant" onPress={onAction} /> : undefined}
      />
    );
  }

  return (
    <EmptyState
      icon="🗓️"
      title="Nothing scheduled yet"
      message="Add plants or enable care reminders to let Sprout remember what to do next."
      action={onAction ? <Button label="Set up reminders" onPress={onAction} /> : undefined}
    />
  );
}

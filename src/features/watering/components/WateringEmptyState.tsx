/**
 * WateringEmptyState — two flavors: "no-gardens" (you can't water without a
 * garden → invite to create one) and "no-history" (gardens exist, but nothing
 * logged yet → gentle nudge to tap Water).
 */

import React from 'react';

import { Button, EmptyState } from '@components/index';

export interface WateringEmptyStateProps {
  variant: 'no-gardens' | 'no-history';
  onAction?: () => void;
}

export function WateringEmptyState({ variant, onAction }: WateringEmptyStateProps) {
  if (variant === 'no-gardens') {
    return (
      <EmptyState
        icon="🪴"
        title="Nothing to water yet"
        message="Create your first garden — then watering it takes a single tap."
        action={onAction ? <Button label="Create a garden" onPress={onAction} /> : undefined}
      />
    );
  }

  return (
    <EmptyState
      icon="💧"
      title="No waterings yet"
      message="Tap “Water” on a garden to log your first one. It only takes a second."
    />
  );
}

/**
 * EmptyProfileState — shown when a brand-new gardener has no gardens yet. Warm
 * and encouraging, always pointing to the next step.
 */

import React from 'react';

import { Button, EmptyState } from '@components/index';

export interface EmptyProfileStateProps {
  onCreateGarden: () => void;
}

export function EmptyProfileState({ onCreateGarden }: EmptyProfileStateProps) {
  return (
    <EmptyState
      icon="🌿"
      title="Your gardening journey is just beginning"
      message="Create your first garden to start tracking plants, waterings, streaks, and the achievements you'll unlock along the way."
      action={<Button label="Create your first garden" onPress={onCreateGarden} />}
    />
  );
}

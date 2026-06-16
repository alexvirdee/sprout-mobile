/**
 * ConfidenceBadge — friendly confidence pill ("Possible match · 61%").
 */

import React from 'react';

import { Badge } from '@components/index';
import { CONFIDENCE_META, confidenceLevel, confidencePercent } from '../utils/confidence';

export interface ConfidenceBadgeProps {
  confidence: number;
}

export function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  const meta = CONFIDENCE_META[confidenceLevel(confidence)];
  return <Badge label={`${meta.label} · ${confidencePercent(confidence)}%`} tone={meta.tone} dot />;
}

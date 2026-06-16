/**
 * careTaskLabels — task-type metadata (emoji, label, badge tone) + priority tone.
 * Pure presentation helpers.
 */

import type { BadgeTone } from '@components/index';
import { CarePriority, CareTaskType } from '../types/care.types';

interface TaskTypeMeta {
  emoji: string;
  label: string;
  tone: BadgeTone;
}

const TASK_TYPE_META: Record<CareTaskType, TaskTypeMeta> = {
  watering: { emoji: '💧', label: 'Watering', tone: 'green' },
  pruning: { emoji: '✂️', label: 'Pruning', tone: 'sage' },
  fertilizing: { emoji: '🌱', label: 'Feeding', tone: 'gold' },
  seed_starting: { emoji: '🌰', label: 'Seed starting', tone: 'terra' },
  transplanting: { emoji: '🪴', label: 'Transplant', tone: 'sage' },
  harvesting: { emoji: '🧺', label: 'Harvest', tone: 'gold' },
  general: { emoji: '🌿', label: 'Care', tone: 'green' },
};

export function taskTypeMeta(type: CareTaskType): TaskTypeMeta {
  return TASK_TYPE_META[type] ?? TASK_TYPE_META.general;
}

export function priorityTone(priority: CarePriority): BadgeTone {
  return priority === 'high' ? 'warning' : priority === 'medium' ? 'gold' : 'neutral';
}

const RECURRENCE_LABELS: Record<string, string> = {
  none: 'One time',
  daily: 'Every day',
  weekly: 'Every week',
  monthly: 'Every month',
  yearly: 'Every year',
};

export function recurrenceLabel(recurrence: string, intervalDays?: number | null): string {
  if (recurrence === 'every_x_days') return intervalDays ? `Every ${intervalDays} days` : 'Repeating';
  return RECURRENCE_LABELS[recurrence] ?? 'One time';
}

/**
 * CareTaskCard — a single care task as a tappable card: type emoji, title, a
 * gentle due badge + recurrence, and an optional one-tap "Done".
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Check, ChevronRight } from 'lucide-react-native';

import { Badge, Card, Emoji, Text } from '@components/index';
import { colors, palette, radii } from '@theme/index';
import { CareTask } from '../types/care.types';
import { recurrenceLabel, taskTypeMeta } from '../utils/careTaskLabels';
import { dueLabel, dueTone } from '../utils/careTaskDates';

export interface CareTaskCardProps {
  task: CareTask;
  onPress?: () => void;
  onComplete?: () => void;
}

export function CareTaskCard({ task, onPress, onComplete }: CareTaskCardProps) {
  const meta = taskTypeMeta(task.taskType);
  return (
    <Card onPress={onPress} padding="sm" radius="lg">
      <View style={styles.row}>
        <View style={styles.chip}>
          <Emoji size={20}>{meta.emoji}</Emoji>
        </View>
        <View style={styles.text}>
          <Text variant="title" color="strong" numberOfLines={1}>
            {task.title}
          </Text>
          <View style={styles.metaRow}>
            <Badge label={dueLabel(task.dueDate)} tone={dueTone(task.dueDate)} />
            {task.recurrence !== 'none' ? (
              <Text variant="caption" color="subtle">
                {recurrenceLabel(task.recurrence, task.recurrenceIntervalDays)}
              </Text>
            ) : null}
          </View>
        </View>
        {onComplete ? (
          <Pressable accessibilityRole="button" accessibilityLabel="Mark done" onPress={onComplete} hitSlop={8} style={styles.done}>
            <Check size={16} color={palette.green[700]} strokeWidth={2.6} />
          </Pressable>
        ) : (
          <ChevronRight size={18} color={colors.text.subtle} />
        )}
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
  text: { flex: 1, rowGap: 4 },
  metaRow: { flexDirection: 'row', alignItems: 'center', columnGap: 8, flexWrap: 'wrap' },
  done: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: palette.green[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
});

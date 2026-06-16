/**
 * UpcomingCareCard — the Home "Upcoming care" list: the next few tasks as compact
 * rows, each tappable (open detail) with a one-tap Done. Headerless — Home's
 * CollapsibleSection provides the title + "See all".
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { Badge, Card, Emoji, Text } from '@components/index';
import { colors, palette, radii } from '@theme/index';
import { CareTask } from '../types/care.types';
import { taskTypeMeta } from '../utils/careTaskLabels';
import { dueLabel, dueTone } from '../utils/careTaskDates';

export interface UpcomingCareCardProps {
  tasks: CareTask[];
  onView: (task: CareTask) => void;
  onComplete: (task: CareTask) => void;
}

export function UpcomingCareCard({ tasks, onView, onComplete }: UpcomingCareCardProps) {
  const shown = tasks.slice(0, 5);

  return (
    <Card padding="none" radius="lg" elevation="sm">
      {shown.map((t, i) => {
        const meta = taskTypeMeta(t.taskType);
        return (
          <View key={t.id}>
            {i > 0 ? <View style={styles.divider} /> : null}
            <Pressable
              accessibilityRole="button"
              onPress={() => onView(t)}
              style={({ pressed }) => (pressed ? styles.pressed : undefined)}
            >
              <View style={styles.row}>
                <View style={styles.chip}>
                  <Emoji size={17}>{meta.emoji}</Emoji>
                </View>
                <View style={styles.text}>
                  <Text variant="title" color="strong" numberOfLines={1}>
                    {t.title}
                  </Text>
                  <Badge label={dueLabel(t.dueDate)} tone={dueTone(t.dueDate)} />
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Mark done"
                  onPress={() => onComplete(t)}
                  hitSlop={8}
                  style={styles.done}
                >
                  <Check size={16} color={palette.green[700]} strokeWidth={2.6} />
                </Pressable>
              </View>
            </Pressable>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  divider: { height: 1, backgroundColor: colors.border.soft, marginLeft: 56 },
  pressed: { backgroundColor: colors.surface.sunken },
  chip: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    backgroundColor: colors.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, rowGap: 4 },
  done: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: palette.green[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/**
 * CareTaskList — a flat list of CareTaskCards (used on the calendar, garden, and
 * plant care views).
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { CareTask } from '../types/care.types';
import { CareTaskCard } from './CareTaskCard';

export interface CareTaskListProps {
  tasks: CareTask[];
  onPressTask: (task: CareTask) => void;
  onComplete?: (task: CareTask) => void;
}

export function CareTaskList({ tasks, onPressTask, onComplete }: CareTaskListProps) {
  return (
    <View style={styles.list}>
      {tasks.map((t) => (
        <CareTaskCard
          key={t.id}
          task={t}
          onPress={() => onPressTask(t)}
          onComplete={onComplete ? () => onComplete(t) : undefined}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({ list: { rowGap: 10 } });

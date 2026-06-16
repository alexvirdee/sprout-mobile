/**
 * CareTaskActions — the action set on the task detail: mark complete, skip,
 * reschedule, delete. Gentle, not nagging.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { Button } from '@components/index';

export interface CareTaskActionsProps {
  onComplete: () => void;
  onSkip: () => void;
  onReschedule: () => void;
  onDelete: () => void;
  completing?: boolean;
}

export function CareTaskActions({ onComplete, onSkip, onReschedule, onDelete, completing }: CareTaskActionsProps) {
  return (
    <View style={styles.wrap}>
      <Button
        label="Mark complete"
        fullWidth
        loading={completing}
        iconLeft={<Check size={18} color="#fff" />}
        onPress={onComplete}
      />
      <View style={styles.row}>
        <View style={styles.flex}>
          <Button label="Skip" variant="secondary" fullWidth onPress={onSkip} />
        </View>
        <View style={styles.flex}>
          <Button label="Reschedule" variant="secondary" fullWidth onPress={onReschedule} />
        </View>
      </View>
      <Button label="Delete reminder" variant="ghost" fullWidth onPress={onDelete} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { rowGap: 12 },
  row: { flexDirection: 'row', columnGap: 12 },
  flex: { flex: 1 },
});

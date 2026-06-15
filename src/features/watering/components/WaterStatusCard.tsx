/**
 * WaterStatusCard — the daily hydration hero. A progress ring (gardens watered
 * today) beside warm, encouraging copy. Positive reinforcement, never nagging.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, ProgressRing, Text } from '@components/index';
import { WateringStats } from '../types/watering.types';

export interface WaterStatusCardProps {
  stats: WateringStats;
}

export function WaterStatusCard({ stats }: WaterStatusCardProps) {
  const { gardensWateredToday, totalGardens, plantsWateredToday, gardensNeedingAttention } = stats;
  const allWatered = totalGardens > 0 && gardensWateredToday >= totalGardens;

  const headline = allWatered ? 'All watered 🌿' : `${gardensWateredToday} of ${totalGardens} watered`;

  const message = allWatered
    ? 'Every garden has had a drink today. Beautiful work.'
    : gardensNeedingAttention > 0
      ? `${gardensNeedingAttention} ${gardensNeedingAttention === 1 ? 'garden could use' : 'gardens could use'} a little water.`
      : 'Keep your gardens happy and hydrated today.';

  return (
    <Card padding="md" radius="xl">
      <View style={styles.row}>
        <ProgressRing
          value={gardensWateredToday}
          max={Math.max(totalGardens, 1)}
          size={88}
          tone={allWatered ? 'green' : 'sage'}
          label={`${gardensWateredToday}/${totalGardens}`}
          sublabel="today"
        />
        <View style={styles.text}>
          <Text variant="h2" color="strong">
            {headline}
          </Text>
          <Text variant="bodySmall" color="muted" style={styles.msg}>
            {message}
          </Text>
          {plantsWateredToday > 0 ? (
            <Text variant="caption" color="subtle" style={styles.sub}>
              🌱 {plantsWateredToday} {plantsWateredToday === 1 ? 'plant' : 'plants'} watered too
            </Text>
          ) : null}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 18 },
  text: { flex: 1, rowGap: 4 },
  msg: { marginTop: 2 },
  sub: { marginTop: 4 },
});

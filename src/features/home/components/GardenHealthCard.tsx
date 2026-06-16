/**
 * GardenHealthCard — a friendly at-a-glance health score (ring + label) with the
 * factors behind it. Headerless — CollapsibleSection provides the title on Home.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Emoji, ProgressRing, Text } from '@components/index';
import { colors } from '@theme/index';
import { GardenHealth } from '../utils/homeHealth';

export interface GardenHealthCardProps {
  health: GardenHealth;
}

export function GardenHealthCard({ health }: GardenHealthCardProps) {
  return (
    <Card padding="md" radius="lg" elevation="sm">
      <View style={styles.top}>
        <ProgressRing
          value={health.score}
          max={100}
          size={92}
          tone={health.tone}
          label={String(health.score)}
          sublabel="health"
        />
        <View style={styles.headline}>
          <Text variant="h2" color="strong">
            {health.label}
          </Text>
          <Text variant="bodySmall" color="muted" style={styles.sub}>
            A quick read on how your gardens are doing.
          </Text>
        </View>
      </View>

      <View style={styles.factors}>
        {health.factors.map((f, i) => (
          <View key={i} style={styles.factor}>
            <Emoji size={15}>{f.emoji}</Emoji>
            <Text variant="bodySmall" color={f.good ? 'body' : 'muted'} style={styles.flex}>
              {f.text}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', columnGap: 18 },
  headline: { flex: 1 },
  sub: { marginTop: 4 },
  flex: { flex: 1 },
  factors: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    rowGap: 10,
  },
  factor: { flexDirection: 'row', alignItems: 'center', columnGap: 10 },
});

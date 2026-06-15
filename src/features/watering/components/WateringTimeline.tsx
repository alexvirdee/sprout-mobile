/**
 * WateringTimeline — watering history grouped into day sections (Today /
 * Yesterday / earlier), each a soft card of entries. Resolves each log's target
 * to a friendly name via the provided lookup maps.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Text } from '@components/index';
import { colors } from '@theme/index';
import { relativeDay } from '@utils/format';
import { WateringLog } from '../types/watering.types';
import { WaterHistoryCard } from './WaterHistoryCard';

export interface WateringTimelineProps {
  logs: WateringLog[];
  gardenNames: Record<string, string>;
  plantNames: Record<string, string>;
}

interface Group {
  label: string;
  items: WateringLog[];
}

export function WateringTimeline({ logs, gardenNames, plantNames }: WateringTimelineProps) {
  // Logs arrive newest-first; group consecutively by relative-day label.
  const groups: Group[] = [];
  for (const log of logs) {
    const label = relativeDay(log.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) last.items.push(log);
    else groups.push({ label, items: [log] });
  }

  const titleFor = (log: WateringLog) =>
    log.plantId ? plantNames[log.plantId] ?? 'A plant' : gardenNames[log.gardenId] ?? 'A garden';

  return (
    <View style={styles.wrap}>
      {groups.map((group) => (
        <View key={group.label} style={styles.group}>
          <Text variant="eyebrow" color="subtle" style={styles.label}>
            {group.label}
          </Text>
          <Card padding="sm" radius="lg">
            {group.items.map((log, i) => (
              <View key={log.id}>
                {i > 0 ? <View style={styles.divider} /> : null}
                <WaterHistoryCard log={log} title={titleFor(log)} />
              </View>
            ))}
          </Card>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { rowGap: 20 },
  group: { rowGap: 10 },
  label: { marginLeft: 4 },
  divider: { height: 1, backgroundColor: colors.border.soft },
});

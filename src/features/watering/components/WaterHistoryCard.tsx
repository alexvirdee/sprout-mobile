/**
 * WaterHistoryCard — a single watering entry in the timeline. A type emoji
 * (light/normal/deep), the resolved target name, target + type detail, and a
 * relative time. The garden-journal building block.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Emoji, Text } from '@components/index';
import { colors, palette, radii } from '@theme/index';
import { relativeTime } from '@utils/format';
import { WateringLog, WATERING_TYPE_OPTIONS } from '../types/watering.types';

export interface WaterHistoryCardProps {
  log: WateringLog;
  /** Pre-resolved display name (plant name, else garden name). */
  title: string;
}

export function WaterHistoryCard({ log, title }: WaterHistoryCardProps) {
  const typeOpt = WATERING_TYPE_OPTIONS.find((o) => o.value === log.wateringType) ?? WATERING_TYPE_OPTIONS[1];
  const target = log.wateringTarget === 'plant' ? 'Plant' : 'Garden';

  return (
    <View style={styles.item}>
      <View style={styles.chip}>
        <Emoji size={18}>{typeOpt.emoji}</Emoji>
      </View>
      <View style={styles.text}>
        <Text variant="title" color="strong" numberOfLines={1}>
          {title}
        </Text>
        <Text variant="caption" color="muted" numberOfLines={1}>
          {target} · {typeOpt.label} watering
        </Text>
      </View>
      <Text variant="caption" color="subtle">
        {relativeTime(log.createdAt)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  item: { flexDirection: 'row', alignItems: 'center', columnGap: 12, paddingVertical: 10 },
  chip: {
    width: 38,
    height: 38,
    borderRadius: radii.sm,
    backgroundColor: palette.green[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, rowGap: 2 },
});

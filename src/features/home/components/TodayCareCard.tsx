/**
 * TodayCareCard — the day's actionable care suggestions. Each row has an icon,
 * a title + short explanation, and a one-tap action button. Headerless — the
 * section title/chevron is provided by CollapsibleSection on Home.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Card, Emoji, Text } from '@components/index';
import { colors, radii } from '@theme/index';
import { CareItem } from '../utils/homeRecommendations';

export interface TodayCareCardProps {
  items: CareItem[];
  onAction: (item: CareItem) => void;
}

export function TodayCareCard({ items, onAction }: TodayCareCardProps) {
  if (items.length === 0) return null;

  return (
    <Card padding="none" radius="lg" elevation="sm">
      {items.map((item, i) => (
        <View key={item.id}>
          {i > 0 ? <View style={styles.divider} /> : null}
          <View style={styles.row}>
            <View style={styles.bullet}>
              <Emoji size={18}>{item.emoji}</Emoji>
            </View>
            <View style={styles.text}>
              <Text variant="title" color="strong">
                {item.title}
              </Text>
              <Text variant="caption" color="muted">
                {item.detail}
              </Text>
            </View>
            <Button label={item.actionLabel} size="sm" variant="secondary" onPress={() => onAction(item)} />
          </View>
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12, padding: 14 },
  divider: { height: 1, backgroundColor: colors.border.soft, marginLeft: 56 },
  bullet: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    backgroundColor: colors.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, rowGap: 2 },
});

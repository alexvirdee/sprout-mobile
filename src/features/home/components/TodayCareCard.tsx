/**
 * TodayCareCard — a playful checklist-style card of the day's care suggestions
 * (rules-based, derived from gardens + weather).
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Emoji, SectionHeader, Text } from '@components/index';
import { colors, radii } from '@theme/index';
import { CareItem } from '../utils/homeRecommendations';

export interface TodayCareCardProps {
  items: CareItem[];
}

export function TodayCareCard({ items }: TodayCareCardProps) {
  return (
    <View>
      <SectionHeader title="Today's care" />
      <Card padding="md" radius="lg">
        <View style={styles.list}>
          {items.map((item) => (
            <View key={item.id} style={styles.row}>
              <View style={styles.bullet}>
                <Emoji size={16}>{item.emoji}</Emoji>
              </View>
              <Text variant="body" color="body" style={styles.text}>{item.text}</Text>
            </View>
          ))}
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  list: { rowGap: 14 },
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  bullet: {
    width: 30,
    height: 30,
    borderRadius: radii.sm,
    backgroundColor: colors.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1 },
});

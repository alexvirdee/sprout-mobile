/**
 * WaterStreakCard — a gentle habit nudge, NOT a game. No points, coins, or
 * badges — just a quiet acknowledgement of consistent care ("3 days in a row")
 * and this week's sessions. Frames watering as a calm rhythm.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Emoji, Text } from '@components/index';
import { colors, palette, radii } from '@theme/index';

export interface WaterStreakCardProps {
  currentStreak: number;
  weekSessions: number;
}

export function WaterStreakCard({ currentStreak, weekSessions }: WaterStreakCardProps) {
  const hasStreak = currentStreak > 0;
  const title = hasStreak
    ? `${currentStreak} ${currentStreak === 1 ? 'day' : 'days'} in a row`
    : 'Start a gentle rhythm';
  const message = hasStreak
    ? "You've tended your gardens day after day. Lovely rhythm."
    : 'Water a garden today to begin a watering streak.';

  return (
    <Card padding="md" radius="lg">
      <View style={styles.row}>
        <View style={styles.chip}>
          <Emoji size={24}>{hasStreak ? '🌿' : '🌱'}</Emoji>
        </View>
        <View style={styles.text}>
          <Text variant="h3" color="strong">
            {title}
          </Text>
          <Text variant="bodySmall" color="muted" style={styles.msg}>
            {message}
          </Text>
        </View>
      </View>
      {weekSessions > 0 ? (
        <View style={styles.footer}>
          <Text variant="caption" color="subtle">
            {weekSessions} {weekSessions === 1 ? 'watering' : 'waterings'} this week
          </Text>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 14 },
  chip: {
    width: 48,
    height: 48,
    borderRadius: radii.md,
    backgroundColor: colors.surface.sageSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, rowGap: 3 },
  msg: { marginTop: 1 },
  footer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
  },
});

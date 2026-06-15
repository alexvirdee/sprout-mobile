/**
 * WateringStreakCard — the streak hero, driven by real watering activity.
 * Shows the current streak in a progress ring (vs. the personal best), with
 * encouraging copy. When there's no streak yet, it invites the first watering.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Flame } from 'lucide-react-native';

import { Button, Card, ProgressRing, Text } from '@components/index';
import { palette } from '@theme/index';

export interface WateringStreakCardProps {
  currentStreak: number;
  longestStreak: number;
  onStart?: () => void;
}

export function WateringStreakCard({ currentStreak, longestStreak, onStart }: WateringStreakCardProps) {
  const hasStreak = currentStreak > 0;
  const ringMax = Math.max(longestStreak, currentStreak, 7);
  const beatsRecord = hasStreak && currentStreak >= longestStreak;

  return (
    <Card padding="md" elevation="sm" radius="lg">
      <View style={styles.row}>
        <ProgressRing
          value={currentStreak}
          max={ringMax}
          label={String(currentStreak)}
          sublabel="days"
          tone="gold"
          size={92}
        />
        <View style={styles.text}>
          <View style={styles.titleRow}>
            <Flame size={16} color={palette.gold[600]} />
            <Text variant="eyebrow" tint={palette.gold[700]}>
              Watering streak
            </Text>
          </View>

          {hasStreak ? (
            <>
              <Text variant="h2" color="strong" style={styles.line}>
                {currentStreak}-day streak
              </Text>
              <Text variant="bodySmall" color="muted" style={styles.line}>
                {beatsRecord
                  ? "That's your best yet — keep it growing! 🔥"
                  : `Your record is ${longestStreak} days. You're building a healthy habit.`}
              </Text>
            </>
          ) : (
            <>
              <Text variant="h2" color="strong" style={styles.line}>
                Start your streak
              </Text>
              <Text variant="bodySmall" color="muted" style={styles.line}>
                Water a garden today and watch your streak grow.
              </Text>
              {onStart ? <Button label="Water a garden" size="sm" onPress={onStart} style={styles.cta} /> : null}
            </>
          )}
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 24 },
  text: { flex: 1 },
  titleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  line: { marginTop: 4 },
  cta: { marginTop: 10, alignSelf: 'flex-start' },
});

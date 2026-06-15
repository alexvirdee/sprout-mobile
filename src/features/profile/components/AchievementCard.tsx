/**
 * AchievementCard — a single achievement as a horizontal row: a warm gradient
 * disc when unlocked (soft dashed + lock when not), title, description, and the
 * unlock date. Encouraging, not gamified.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Lock } from 'lucide-react-native';

import { Card, Emoji, Text } from '@components/index';
import { colors, palette } from '@theme/index';
import { Achievement, AchievementTone } from '../types/profile.types';
import { unlockedDateLabel } from '../utils/profileFormat';

const GRADIENTS: Record<AchievementTone, readonly [string, string]> = {
  green: [palette.green[400], palette.green[600]],
  gold: [palette.gold[300], palette.gold[500]],
  terra: [palette.terra[300], palette.terra[500]],
  sage: [palette.sageScale[300], palette.sageScale[500]],
};

export interface AchievementCardProps {
  achievement: Achievement;
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const { unlocked, icon, title, description, tone, unlockedAt } = achievement;
  const date = unlockedDateLabel(unlockedAt);

  return (
    <Card padding="sm" radius="lg" elevation={unlocked ? 'sm' : 'none'} style={unlocked ? undefined : styles.lockedCard}>
      <View style={styles.row}>
        {unlocked ? (
          <LinearGradient colors={GRADIENTS[tone]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.disc}>
            <Emoji size={24}>{icon}</Emoji>
          </LinearGradient>
        ) : (
          <View style={[styles.disc, styles.lockedDisc]}>
            <Emoji size={24} style={styles.lockedEmoji}>
              {icon}
            </Emoji>
          </View>
        )}

        <View style={styles.text}>
          <Text variant="title" color={unlocked ? 'strong' : 'muted'} numberOfLines={1}>
            {title}
          </Text>
          <Text variant="caption" color="muted" numberOfLines={2}>
            {description}
          </Text>
          {unlocked && date ? (
            <Text variant="caption" color="subtle" style={styles.date}>
              {date}
            </Text>
          ) : null}
        </View>

        {unlocked ? (
          <View style={styles.checkChip}>
            <Check size={16} color={palette.green[700]} strokeWidth={2.6} />
          </View>
        ) : (
          <Lock size={18} color={colors.text.subtle} />
        )}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  lockedCard: { backgroundColor: colors.surface.sunken },
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 14 },
  disc: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  lockedDisc: {
    backgroundColor: palette.neutral[150],
    borderWidth: 2,
    borderColor: palette.neutral[300],
    borderStyle: 'dashed',
  },
  lockedEmoji: { opacity: 0.45 },
  text: { flex: 1, rowGap: 2 },
  date: { marginTop: 2 },
  checkChip: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: palette.green[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
});

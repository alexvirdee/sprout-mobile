/**
 * AchievementBadge — reward for harvests, streaks, and seasons. Unlocked badges
 * sit on a warm gradient disc; locked ones are a soft dashed placeholder.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Lock } from 'lucide-react-native';

import { colors, palette, shadows } from '@theme/index';
import { Text } from '../ui/Text';
import { Emoji } from '../ui/Emoji';

type Tone = 'green' | 'gold' | 'terra' | 'sage';

const TONE_GRADIENTS: Record<Tone, readonly [string, string, ...string[]]> = {
  green: [palette.green[400], palette.green[600]],
  gold: [palette.gold[300], palette.gold[500]],
  terra: [palette.terra[300], palette.terra[500]],
  sage: [palette.sageScale[300], palette.sageScale[500]],
};

export interface AchievementBadgeProps {
  icon?: string;
  title: string;
  caption?: string;
  tone?: Tone;
  unlocked?: boolean;
  size?: number;
}

export function AchievementBadge({
  icon = '🌱',
  title,
  caption,
  tone = 'green',
  unlocked = true,
  size = 92,
}: AchievementBadgeProps) {
  return (
    <View style={[styles.wrap, { width: size + 36 }]}>
      <View style={styles.discWrap}>
        {unlocked ? (
          <LinearGradient
            colors={TONE_GRADIENTS[tone]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[styles.disc, { width: size, height: size, borderRadius: size / 2 }, shadows.md]}
          >
            <Emoji size={size * 0.42}>{icon}</Emoji>
          </LinearGradient>
        ) : (
          <View
            style={[
              styles.disc,
              styles.locked,
              { width: size, height: size, borderRadius: size / 2 },
            ]}
          >
            <Emoji size={size * 0.42} style={{ opacity: 0.45 }}>{icon}</Emoji>
            <View style={styles.lockChip}>
              <Lock size={13} color={colors.text.subtle} strokeWidth={2.4} />
            </View>
          </View>
        )}
      </View>
      <Text variant="label" color={unlocked ? 'strong' : 'muted'} align="center" numberOfLines={1}>
        {title}
      </Text>
      {caption ? (
        <Text variant="caption" color="subtle" align="center">
          {caption}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', rowGap: 6 },
  discWrap: { marginBottom: 4 },
  disc: {
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.surface.card,
  },
  locked: {
    backgroundColor: palette.neutral[150],
    borderStyle: 'dashed',
    borderColor: palette.neutral[300],
  },
  lockChip: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: colors.surface.card,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.sm,
  },
});

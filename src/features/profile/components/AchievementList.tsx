/**
 * AchievementList — the full achievements list, unlocked first. Used on the
 * Achievements screen.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Achievement } from '../types/profile.types';
import { AchievementCard } from './AchievementCard';

export interface AchievementListProps {
  achievements: Achievement[];
}

export function AchievementList({ achievements }: AchievementListProps) {
  const sorted = [...achievements].sort((a, b) => Number(b.unlocked) - Number(a.unlocked));
  return (
    <View style={styles.list}>
      {sorted.map((a) => (
        <AchievementCard key={a.id} achievement={a} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { rowGap: 12 },
});

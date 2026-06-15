/**
 * HomeHeader — warm greeting banner: the time-of-day greeting + first name, the
 * date, a playful subline, and the user's avatar.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { Avatar, Text } from '@components/index';
import { gradients, gutter, spacing } from '@theme/index';
import { firstName, greeting } from '@utils/format';

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export interface HomeHeaderProps {
  name: string;
  avatar?: string | null;
  topInset: number;
}

export function HomeHeader({ name, avatar, topInset }: HomeHeaderProps) {
  const now = new Date();
  const dateLabel = `${DAYS[now.getDay()]}, ${MONTHS[now.getMonth()]} ${now.getDate()}`;

  return (
    <LinearGradient
      colors={gradients.dawn.colors}
      start={gradients.dawn.start}
      end={gradients.dawn.end}
      style={[styles.header, { paddingTop: topInset + 14 }]}
    >
      <View style={styles.row}>
        <View style={styles.flex}>
          <Text variant="bodySmall" color="muted">{dateLabel}</Text>
          <Text variant="display" color="strong" style={styles.greeting}>
            {greeting()}, {firstName(name)}
          </Text>
          <Text variant="bodyLarge" color="muted" style={styles.subtext}>
            Let's check on your growing spaces 🌱
          </Text>
        </View>
        <Avatar name={name} source={avatar} size="md" ring />
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: gutter, paddingBottom: spacing.lg },
  row: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', columnGap: spacing.md },
  flex: { flex: 1 },
  greeting: { marginTop: 4 },
  subtext: { marginTop: 6 },
});

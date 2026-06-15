/**
 * AchievementsScreen — the full achievements list with a progress hero. Unlocked
 * milestones first; locked ones shown as gentle, encouraging goals.
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';

import { Card, IconButton, ProgressRing, Skeleton, Text } from '@components/index';
import { colors, gutter, radii, spacing } from '@theme/index';
import { ProfileStackScreenProps } from '@app-types/navigation';
import { useAchievements } from '../hooks/useAchievements';
import { AchievementList } from '../components';

export function AchievementsScreen({ navigation }: ProfileStackScreenProps<'Achievements'>) {
  const insets = useSafeAreaInsets();
  const { data, isLoading } = useAchievements();
  const achievements = data?.achievements ?? [];
  const unlocked = data?.unlockedCount ?? 0;
  const total = data?.total ?? achievements.length;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.text.body} />
        </IconButton>
        <Text variant="h2" color="strong">
          Achievements
        </Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 40 }]}
      >
        {isLoading ? (
          <View style={styles.list}>
            <Skeleton height={120} radius={radii.lg} />
            <Skeleton height={88} radius={radii.lg} />
            <Skeleton height={88} radius={radii.lg} />
          </View>
        ) : (
          <>
            <Card padding="md" radius="lg" elevation="sm">
              <View style={styles.heroRow}>
                <ProgressRing
                  value={unlocked}
                  max={Math.max(total, 1)}
                  label={`${unlocked}/${total}`}
                  sublabel="unlocked"
                  tone="gold"
                  size={92}
                />
                <View style={styles.heroText}>
                  <Text variant="h2" color="strong">
                    {unlocked === total ? 'All unlocked! 🌟' : 'Keep growing'}
                  </Text>
                  <Text variant="bodySmall" color="muted" style={styles.heroMsg}>
                    {unlocked === total
                      ? "You've earned every achievement — what a gardener."
                      : 'Each one celebrates a real milestone in your garden.'}
                  </Text>
                </View>
              </View>
            </Card>

            <AchievementList achievements={achievements} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    paddingHorizontal: gutter,
    paddingBottom: spacing.base,
  },
  spacer: { width: 42 },
  body: { paddingHorizontal: gutter, paddingTop: spacing.sm, rowGap: spacing.lg },
  list: { rowGap: spacing.base },
  heroRow: { flexDirection: 'row', alignItems: 'center', columnGap: spacing.lg },
  heroText: { flex: 1 },
  heroMsg: { marginTop: 4 },
});

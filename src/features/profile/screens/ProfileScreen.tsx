/**
 * ProfileScreen — the "You" tab: a warm, real-data account center. Identity
 * header, watering streak, gardening stats (or a first-garden invite), an
 * achievements preview, a Preferences entry, and the Account section. Pull to
 * refresh. Demo mode shows a gentle "sign in to track real data" note.
 */

import React, { useEffect, useState } from 'react';
import { Alert, Linking, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Bell, Moon } from 'lucide-react-native';

import { AchievementBadge, Card, SectionHeader, Skeleton, Text } from '@components/index';
import { colors, gutter, palette, radii, spacing } from '@theme/index';
import { ProfileStackScreenProps } from '@app-types/navigation';
import { useAuth } from '@hooks/useAuth';
import { FlashBanner } from '@features/gardens/components/FlashBanner';
import { useProfile } from '../hooks/useProfile';
import { useProfileStats } from '../hooks/useProfileStats';
import { useAchievements } from '../hooks/useAchievements';
import {
  AccountSection,
  EmptyProfileState,
  ProfileHeader,
  SettingDivider,
  SettingRow,
  StatsGrid,
  WateringStreakCard,
} from '../components';
import { APP_VERSION, SPROUT_LINKS } from '../constants';

const THEME_LABELS = { system: 'System', light: 'Light', dark: 'Dark' } as const;

export function ProfileScreen({ navigation, route }: ProfileStackScreenProps<'ProfileHome'>) {
  const insets = useSafeAreaInsets();
  const { user, isDemo } = useProfile();
  const { logout } = useAuth();
  const statsQuery = useProfileStats();
  const achievementsQuery = useAchievements();

  const [flash, setFlash] = useState<string | undefined>(route.params?.flash);
  useEffect(() => {
    if (route.params?.flash) {
      setFlash(route.params.flash);
      navigation.setParams({ flash: undefined });
    }
  }, [route.params?.flash, navigation]);

  const stats = statsQuery.data;
  const achievements = [...(achievementsQuery.data?.achievements ?? [])].sort(
    (a, b) => Number(b.unlocked) - Number(a.unlocked)
  );
  const unlockedCount = achievementsQuery.data?.unlockedCount ?? 0;
  const total = achievementsQuery.data?.total ?? 0;
  const brandNew = !!stats && stats.gardens === 0 && stats.plants === 0 && stats.wateringSessions === 0;
  const themeLabel = THEME_LABELS[user?.themePreference ?? 'system'];

  const goCreateGarden = () => navigation.navigate('Garden', { screen: 'CreateGarden' });
  const goGardens = () => navigation.navigate('Garden', { screen: 'GardensList' });
  const goAddPlant = () => navigation.navigate('Garden', { screen: 'AddPlant' });
  const goWater = () => navigation.navigate('Water');

  const refresh = () => {
    if (isDemo) return;
    void statsQuery.refetch();
    void achievementsQuery.refetch();
  };

  const confirmSignOut = () =>
    Alert.alert('Sign out?', 'You can sign back in anytime.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign out', style: 'destructive', onPress: () => void logout() },
    ]);

  const comingSoon = (what: string) => Alert.alert('Coming soon', `${what} arrives in an upcoming update. 🌱`);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
        refreshControl={
          <RefreshControl
            refreshing={statsQuery.isRefetching || achievementsQuery.isRefetching}
            onRefresh={refresh}
            tintColor={palette.green[500]}
          />
        }
      >
        <ProfileHeader
          user={user}
          isDemo={isDemo}
          topInset={insets.top}
          onEditPress={() => navigation.navigate('EditProfile')}
        />

        <View style={styles.body}>
          {flash ? <FlashBanner message={flash} onDone={() => setFlash(undefined)} /> : null}

          {isDemo ? (
            <Card padding="md" radius="lg">
              <Text variant="h3" color="strong">You're in demo mode</Text>
              <Text variant="bodySmall" color="muted" style={styles.demoMsg}>
                Create an account to track your real gardens, watering streaks, and the achievements you unlock
                along the way.
              </Text>
            </Card>
          ) : statsQuery.isLoading ? (
            <>
              <Skeleton height={132} radius={radii.lg} />
              <Skeleton height={120} radius={radii.lg} />
            </>
          ) : stats ? (
            <>
              <WateringStreakCard
                currentStreak={stats.currentStreak}
                longestStreak={stats.longestStreak}
                onStart={goWater}
              />
              {brandNew ? (
                <EmptyProfileState onCreateGarden={goCreateGarden} />
              ) : (
                <StatsGrid
                  stats={stats}
                  onPressGardens={goGardens}
                  onPressPlants={goAddPlant}
                  onPressWaterings={goWater}
                />
              )}
            </>
          ) : null}

          {/* Achievements preview */}
          {!isDemo ? (
            <View>
              <SectionHeader
                title="Achievements"
                actionLabel={achievements.length ? 'See all' : undefined}
                onActionPress={achievements.length ? () => navigation.navigate('Achievements') : undefined}
              />
              {achievementsQuery.isLoading ? (
                <Skeleton height={108} radius={radii.lg} />
              ) : achievements.length === 0 ? (
                <Text variant="bodySmall" color="muted">
                  Your gardening journey is just beginning. Achievements unlock as you grow. 🌱
                </Text>
              ) : (
                <>
                  <Text variant="caption" color="muted" style={styles.achCount}>
                    {unlockedCount} of {total} unlocked
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.badgeRow}>
                    {achievements.map((a) => (
                      <AchievementBadge
                        key={a.id}
                        icon={a.icon}
                        title={a.title}
                        tone={a.tone}
                        unlocked={a.unlocked}
                        size={80}
                      />
                    ))}
                  </ScrollView>
                </>
              )}
            </View>
          ) : null}

          {/* Preferences entry */}
          <View>
            <SectionHeader title="Preferences" />
            <Card padding="none" elevation="sm" radius="lg">
              <SettingRow
                icon={<Bell size={18} color={palette.green[700]} />}
                label="Notifications"
                hint="Reminders, tips, and milestones"
                onPress={() => navigation.navigate('Preferences')}
              />
              <SettingDivider />
              <SettingRow
                icon={<Moon size={18} color={palette.sageScale[700]} />}
                label="Appearance"
                value={themeLabel}
                onPress={() => navigation.navigate('Preferences')}
              />
            </Card>
          </View>

          <AccountSection
            version={APP_VERSION}
            onChangePassword={() => comingSoon('Password changes')}
            onAbout={() => navigation.navigate('About')}
            onPrivacy={() => void Linking.openURL(SPROUT_LINKS.privacy)}
            onTerms={() => void Linking.openURL(SPROUT_LINKS.terms)}
            onSignOut={confirmSignOut}
            onDeleteAccount={() => comingSoon('Account deletion')}
          />

          <Text variant="caption" color="subtle" align="center" style={styles.footer}>
            Sprout v{APP_VERSION} · Watching your garden thrive
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  body: { paddingHorizontal: gutter, paddingTop: spacing.lg, rowGap: spacing.lg },
  demoMsg: { marginTop: 6 },
  achCount: { marginTop: -4, marginBottom: 10 },
  badgeRow: { columnGap: 4, paddingVertical: 2, paddingRight: spacing.lg },
  footer: { marginTop: spacing.sm },
});

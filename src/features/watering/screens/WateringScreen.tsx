/**
 * WateringScreen — the Water tab. A weather-aware daily hydration dashboard:
 * today's status, a watering tip, a gentle streak, then each garden as a
 * one-tap "Water" card (the primary <5s path), plus a recent-history preview.
 */

import React, { useMemo } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';

import { SectionHeader, Skeleton, Text } from '@components/index';
import { colors, gradients, gutter, palette, radii, spacing } from '@theme/index';
import { WateringStackScreenProps } from '@app-types/navigation';
import { useWateringDashboard } from '../hooks/useWateringDashboard';
import {
  WaterGardenCard,
  WaterStatusCard,
  WaterStreakCard,
  WateringEmptyState,
  WateringTimeline,
  WeatherWateringCard,
} from '../components';
import { WateringType } from '../types/watering.types';

export function WateringScreen({ navigation }: WateringStackScreenProps<'WateringHome'>) {
  const insets = useSafeAreaInsets();
  const {
    gardens,
    gardensQuery,
    plants,
    logs,
    stats,
    weather,
    locationStatus,
    requestLocation,
    createWatering,
    refresh,
    isRefreshing,
  } = useWateringDashboard();

  const hasGardens = gardens.length > 0;
  const gardenNames = useMemo(() => Object.fromEntries(gardens.map((g) => [g.id, g.name])), [gardens]);
  const plantNames = useMemo(() => Object.fromEntries(plants.map((p) => [p.id, p.name])), [plants]);
  const recent = logs.slice(0, 5);

  const waterGarden = (gardenId: string, wateringType: WateringType = 'normal') =>
    createWatering.mutate({ gardenId, wateringTarget: 'garden', wateringType });

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={palette.green[500]} />
        }
      >
        <LinearGradient
          colors={gradients.meadow.colors}
          start={gradients.meadow.start}
          end={gradients.meadow.end}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <Text variant="display" color="strong">
            Water
          </Text>
          <Text variant="bodyLarge" color="muted" style={styles.helper}>
            {hasGardens
              ? 'A single tap keeps your gardens thriving.'
              : 'Your gardens, hydrated and happy.'}
          </Text>
        </LinearGradient>

        <View style={styles.body}>
          {gardensQuery.isLoading ? (
            <>
              <Skeleton height={120} radius={radii.xl} />
              <Skeleton height={92} radius={radii.lg} />
              <Skeleton height={160} radius={radii.lg} />
            </>
          ) : !hasGardens ? (
            <WateringEmptyState
              variant="no-gardens"
              onAction={() => navigation.navigate('Garden', { screen: 'CreateGarden' })}
            />
          ) : (
            <>
              {stats ? <WaterStatusCard stats={stats} /> : null}

              <WeatherWateringCard
                status={locationStatus}
                weather={weather.data}
                isLoading={weather.isLoading}
                isError={weather.isError}
                onEnable={requestLocation}
              />

              {stats ? (
                <WaterStreakCard currentStreak={stats.currentStreak} weekSessions={stats.weekSessions} />
              ) : null}

              <View>
                <SectionHeader title="Your gardens" />
                <View style={styles.list}>
                  {gardens.map((g) => (
                    <WaterGardenCard
                      key={g.id}
                      garden={g}
                      onQuickWater={() => waterGarden(g.id)}
                      onPress={() => navigation.navigate('LogWatering', { gardenId: g.id })}
                    />
                  ))}
                </View>
              </View>

              {recent.length > 0 ? (
                <View>
                  <SectionHeader
                    title="Recent"
                    actionLabel="See all"
                    onActionPress={() => navigation.navigate('WateringHistory')}
                  />
                  <WateringTimeline logs={recent} gardenNames={gardenNames} plantNames={plantNames} />
                </View>
              ) : null}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  header: { paddingHorizontal: gutter, paddingBottom: spacing.lg },
  helper: { marginTop: 4 },
  body: { paddingHorizontal: gutter, paddingTop: spacing.lg, rowGap: spacing.lg },
  list: { rowGap: spacing.base },
});

/**
 * HomeScreen — "Today in your garden". A weather-aware, garden-data-driven daily
 * dashboard: greeting, weather + recommendation, garden overview (or empty
 * state), today's care, a seasonal tip, and quick actions. Pull-to-refresh.
 */

import React from 'react';
import { Alert, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import { Skeleton } from '@components/index';
import { colors, gutter, palette, radii, spacing } from '@theme/index';
import { AppTabScreenProps } from '@app-types/navigation';
import { useAuth } from '@hooks/useAuth';
import { useHomeDashboard } from '../hooks/useHomeDashboard';
import { useDailyGardenTip } from '../hooks/useDailyGardenTip';
import { HomeHeader } from '../components/HomeHeader';
import { WeatherCard } from '../components/WeatherCard';
import { GardenOverviewCard } from '../components/GardenOverviewCard';
import { TodayCareCard } from '../components/TodayCareCard';
import { SeasonalTipCard } from '../components/SeasonalTipCard';
import { QuickActions } from '../components/QuickActions';
import { HomeEmptyState } from '../components/HomeEmptyState';

export function HomeScreen({ navigation }: AppTabScreenProps<'Home'>) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const {
    gardens,
    gardensQuery,
    weather,
    locationStatus,
    requestLocation,
    totalPlants,
    totalTasks,
    totalGardens,
    care,
    mood,
    refresh,
    isRefreshing,
  } = useHomeDashboard();
  const tip = useDailyGardenTip();

  const goToCreateGarden = () => navigation.navigate('Garden', { screen: 'CreateGarden' });
  const goToGardens = () => navigation.navigate('Garden', { screen: 'GardensList' });
  const goToGarden = (id: string) => navigation.navigate('Garden', { screen: 'GardenDetail', params: { id } });
  const comingSoon = (label: string) => Alert.alert('Coming soon', `${label} arrive in an upcoming update. 🌱`);

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
        <HomeHeader name={user?.name ?? 'friend'} avatar={user?.avatar} topInset={insets.top} />

        <View style={styles.body}>
          <WeatherCard
            status={locationStatus}
            weather={weather.data}
            isLoading={weather.isLoading}
            isError={weather.isError}
            onEnable={requestLocation}
          />

          {gardensQuery.isLoading ? (
            <Skeleton height={160} radius={radii.lg} />
          ) : totalGardens > 0 ? (
            <GardenOverviewCard
              gardens={gardens}
              totalPlants={totalPlants}
              totalTasks={totalTasks}
              mood={mood}
              onSeeAll={goToGardens}
              onPressGarden={goToGarden}
            />
          ) : (
            <HomeEmptyState onCreate={goToCreateGarden} />
          )}

          <TodayCareCard items={care} />
          <SeasonalTipCard tip={tip} />
          <QuickActions
            onAddGarden={goToCreateGarden}
            onAddPlant={() => navigation.navigate('Garden', { screen: 'AddPlant' })}
            onWater={() => navigation.navigate('Water')}
            onComingSoon={comingSoon}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  body: { paddingHorizontal: gutter, paddingTop: spacing.lg, rowGap: spacing.lg },
});

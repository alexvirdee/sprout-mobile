/**
 * HomeScreen — "What should I do next?" A weather-aware daily companion: greeting
 * + weather, quick actions, a gentle streak, then customizable content sections
 * (today's care, needs attention, garden health, your gardens, recent activity),
 * the AI scan highlight, and a seasonal tip. Sections are collapsible +
 * reorderable (Customize), saved per device. Composes existing data — no extra
 * calls. Pull-to-refresh.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Animated, Pressable, RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useScrollToTop } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SlidersHorizontal } from 'lucide-react-native';

import { Skeleton, Text } from '@components/index';
import { colors, gutter, palette, radii, spacing } from '@theme/index';
import { AppTabScreenProps } from '@app-types/navigation';
import { useAuth } from '@hooks/useAuth';
import { ScanPlantCard } from '@features/ai/components';
import { WaterStreakCard } from '@features/watering/components';
import { useDeleteWatering } from '@features/watering/hooks/useDeleteWatering';
import { UpcomingCareCard } from '@features/care/components';
import { useCompleteCareTask } from '@features/care/hooks/useCareTaskActions';
import { CareTask } from '@features/care/types/care.types';
import { useHomeDashboard } from '../hooks/useHomeDashboard';
import { useDailyGardenTip } from '../hooks/useDailyGardenTip';
import { HOME_SECTIONS, HomeSectionKey, useHomeLayout } from '../hooks/useHomeLayout';
import { HomeHeader } from '../components/HomeHeader';
import { WeatherCard } from '../components/WeatherCard';
import { QuickActions } from '../components/QuickActions';
import { TodayCareCard } from '../components/TodayCareCard';
import { NeedsAttentionCard } from '../components/NeedsAttentionCard';
import { GardenHealthCard } from '../components/GardenHealthCard';
import { GardenSummaryList } from '../components/GardenSummaryList';
import { RecentActivityCard } from '../components/RecentActivityCard';
import { SeasonalTipCard } from '../components/SeasonalTipCard';
import { HomeEmptyState } from '../components/HomeEmptyState';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { CustomizeHomeSheet } from '../components/CustomizeHomeSheet';
import { CareItem } from '../utils/homeRecommendations';
import { ActivityItem } from '../utils/homeActivity';

const titleFor = (key: HomeSectionKey) => HOME_SECTIONS.find((s) => s.key === key)?.title ?? key;

export function HomeScreen({ navigation }: AppTabScreenProps<'Home'>) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();

  // Tapping the Home tab while scrolled scrolls back to the top.
  const scrollRef = useRef<ScrollView>(null);
  useScrollToTop(scrollRef);
  const {
    gardens,
    hasGardens,
    weather,
    locationStatus,
    requestLocation,
    care,
    attention,
    health,
    activity,
    careTasks,
    stats,
    gardensQuery,
    refresh,
    isRefreshing,
  } = useHomeDashboard();
  const tip = useDailyGardenTip();
  const deleteWatering = useDeleteWatering();
  const completeCare = useCompleteCareTask();

  const order = useHomeLayout((s) => s.order);
  const collapsed = useHomeLayout((s) => s.collapsed);
  const hidden = useHomeLayout((s) => s.hidden);
  const toggleCollapsed = useHomeLayout((s) => s.toggleCollapsed);
  const hydrateLayout = useHomeLayout((s) => s.hydrate);
  const [customizing, setCustomizing] = useState(false);

  useEffect(() => {
    void hydrateLayout();
  }, [hydrateLayout]);

  const goCreateGarden = () => navigation.navigate('Garden', { screen: 'CreateGarden' });
  const goGardens = () => navigation.navigate('Garden', { screen: 'GardensList' });
  const goGarden = (id: string) => navigation.navigate('Garden', { screen: 'GardenDetail', params: { id } });
  const goAddPlant = () => navigation.navigate('Garden', { screen: 'AddPlant' });
  const goScan = () => navigation.navigate('Garden', { screen: 'AIPlantScan' });
  const goWater = () => navigation.navigate('Water');
  const goCareCalendar = () => navigation.navigate('Garden', { screen: 'CareCalendar' });
  const onViewCareTask = (t: CareTask) => navigation.navigate('Garden', { screen: 'CareTaskDetail', params: { id: t.id } });
  const onCompleteCareTask = (t: CareTask) => completeCare.mutate(t.id);

  const onCareAction = (item: CareItem) => {
    switch (item.action) {
      case 'create-garden':
        return goCreateGarden();
      case 'add-plant':
        return goAddPlant();
      case 'water':
        return item.gardenId
          ? navigation.navigate('Water', { screen: 'LogWatering', params: { gardenId: item.gardenId } })
          : goWater();
      case 'scan':
        return goScan();
      case 'review':
      default:
        return goGardens();
    }
  };

  const onOpenActivity = (item: ActivityItem) =>
    item.target.kind === 'plant'
      ? navigation.navigate('Garden', { screen: 'PlantDetail', params: { id: item.target.id } })
      : goGarden(item.target.id);

  const onUndoWatering = (id: string) => deleteWatering.mutate(id);

  // Subtle fade-in for the dashboard body on mount.
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(fade, { toValue: 1, duration: 380, useNativeDriver: true }).start();
  }, [fade]);

  const sectionNodes: Record<HomeSectionKey, React.ReactNode> = {
    upcoming: careTasks.length > 0 ? <UpcomingCareCard tasks={careTasks} onView={onViewCareTask} onComplete={onCompleteCareTask} /> : null,
    care: care.length > 0 ? <TodayCareCard items={care} onAction={onCareAction} /> : null,
    attention: <NeedsAttentionCard items={attention} onPress={goGarden} />,
    health: <GardenHealthCard health={health} />,
    gardens: <GardenSummaryList gardens={gardens.slice(0, 3)} onPressGarden={goGarden} />,
    activity: <RecentActivityCard items={activity} onOpen={onOpenActivity} onUndo={onUndoWatering} />,
  };
  const sectionAction: Partial<Record<HomeSectionKey, { label: string; onPress: () => void }>> = {
    upcoming: { label: 'See all', onPress: goCareCalendar },
    gardens: { label: 'See all', onPress: goGardens },
  };

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor={palette.green[500]} />
        }
      >
        <HomeHeader name={user?.name ?? 'friend'} avatar={user?.avatar} topInset={insets.top} />

        <Animated.View style={[styles.body, { opacity: fade }]}>
          <WeatherCard
            status={locationStatus}
            weather={weather.data}
            isLoading={weather.isLoading}
            isError={weather.isError}
            onEnable={requestLocation}
          />

          <QuickActions onScan={goScan} onAddPlant={goAddPlant} onWater={goWater} onCreateGarden={goCreateGarden} />

          {stats && (stats.currentStreak > 0 || stats.weekSessions > 0) ? (
            <WaterStreakCard currentStreak={stats.currentStreak} weekSessions={stats.weekSessions} />
          ) : null}

          {gardensQuery.isLoading ? (
            <>
              <Skeleton height={140} radius={radii.lg} />
              <Skeleton height={120} radius={radii.lg} />
            </>
          ) : hasGardens ? (
            <>
              <View style={styles.customizeRow}>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Customize Home"
                  onPress={() => setCustomizing(true)}
                  hitSlop={8}
                  style={styles.customizeBtn}
                >
                  <SlidersHorizontal size={15} color={palette.green[700]} />
                  <Text variant="label" tint={palette.green[700]}>
                    Customize
                  </Text>
                </Pressable>
              </View>

              {order
                .filter((k) => !hidden[k] && sectionNodes[k] != null)
                .map((k) => (
                  <CollapsibleSection
                    key={k}
                    title={titleFor(k)}
                    collapsed={!!collapsed[k]}
                    onToggle={() => toggleCollapsed(k)}
                    actionLabel={sectionAction[k]?.label}
                    onAction={sectionAction[k]?.onPress}
                  >
                    {sectionNodes[k]}
                  </CollapsibleSection>
                ))}

              <ScanPlantCard onPress={goScan} />
              <SeasonalTipCard tip={tip} />
            </>
          ) : (
            <>
              <HomeEmptyState onCreate={goCreateGarden} />
              <ScanPlantCard onPress={goScan} />
            </>
          )}
        </Animated.View>
      </ScrollView>

      <CustomizeHomeSheet visible={customizing} onClose={() => setCustomizing(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  // Tightened paddingTop so the weather card sits close to the greeting.
  body: { paddingHorizontal: gutter, paddingTop: spacing.md, rowGap: spacing.lg },
  customizeRow: { flexDirection: 'row', justifyContent: 'flex-end', marginBottom: -spacing.sm },
  customizeBtn: { flexDirection: 'row', alignItems: 'center', columnGap: 5, paddingVertical: 4, paddingHorizontal: 6 },
});

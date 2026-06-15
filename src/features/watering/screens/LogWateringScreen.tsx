/**
 * LogWateringScreen — the optional detail flow for one garden, opened by tapping
 * a garden card. Pick how much water (light / normal / deep), then water the
 * whole garden in a tap — or water individual plants. Detail is always optional;
 * the fast path lives on the Water tab.
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';

import { Card, Emoji, IconButton, SegmentedControl, Text } from '@components/index';
import { colors, gutter, spacing } from '@theme/index';
import { WateringStackScreenProps } from '@app-types/navigation';
import { useGarden } from '@features/gardens/hooks/useGarden';
import { usePlants } from '@features/plants/hooks/usePlants';
import { useDeviceLocation } from '@features/weather/hooks/useDeviceLocation';
import { useCurrentWeather } from '@features/weather/hooks/useCurrentWeather';
import { useCreateWatering } from '../hooks/useCreateWatering';
import { WATERING_TYPE_OPTIONS, WateringType } from '../types/watering.types';
import { daysSinceWatered } from '../utils/hydrationStatus';
import { QuickWaterButton, WaterPlantCard, WeatherWateringCard } from '../components';

export function LogWateringScreen({ navigation, route }: WateringStackScreenProps<'LogWatering'>) {
  const { gardenId } = route.params;
  const insets = useSafeAreaInsets();
  const { data: garden } = useGarden(gardenId);
  const { data: plants } = usePlants(gardenId);
  const createWatering = useCreateWatering();
  const { coords, status: locationStatus, request: requestLocation } = useDeviceLocation();
  const weather = useCurrentWeather(coords);

  const [type, setType] = useState<WateringType>('normal');
  const selected = WATERING_TYPE_OPTIONS.find((o) => o.value === type) ?? WATERING_TYPE_OPTIONS[1];
  const gardenWateredToday = daysSinceWatered(garden?.lastWateredAt) === 0;
  const gardenPlants = plants ?? [];

  const waterGarden = () => createWatering.mutate({ gardenId, wateringTarget: 'garden', wateringType: type });
  const waterPlant = (plantId: string) =>
    createWatering.mutate({ gardenId, plantId, wateringTarget: 'plant', wateringType: type });

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.text.body} />
        </IconButton>
        <Text variant="h2" color="strong" numberOfLines={1} style={styles.title}>
          {garden?.name ?? 'Water'}
        </Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 40 }]}
      >
        <WeatherWateringCard
          status={locationStatus}
          weather={weather.data}
          isLoading={weather.isLoading}
          isError={weather.isError}
          onEnable={requestLocation}
        />

        <Card padding="md" radius="xl">
          <Text variant="h3" color="strong">
            Water the whole garden
          </Text>
          <Text variant="bodySmall" color="muted" style={styles.cardMsg}>
            Choose how much, then tap to log it for the whole garden at once.
          </Text>
          <SegmentedControl
            options={WATERING_TYPE_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
            value={type}
            onChange={setType}
            style={styles.segments}
          />
          <View style={styles.hintRow}>
            <Emoji size={16}>{selected.emoji}</Emoji>
            <Text variant="caption" color="muted">
              {selected.hint}
            </Text>
          </View>
          <View style={styles.cta}>
            <QuickWaterButton onWater={waterGarden} watered={gardenWateredToday} size="md" />
          </View>
        </Card>

        {gardenPlants.length > 0 ? (
          <View>
            <Text variant="h3" color="strong" style={styles.sectionTitle}>
              Or water individual plants
            </Text>
            <View style={styles.list}>
              {gardenPlants.map((p) => (
                <WaterPlantCard key={p.id} plant={p} onQuickWater={() => waterPlant(p.id)} />
              ))}
            </View>
          </View>
        ) : null}
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
  title: { flex: 1 },
  spacer: { width: 42 },
  body: { paddingHorizontal: gutter, paddingTop: spacing.sm, rowGap: spacing.lg },
  cardMsg: { marginTop: 4 },
  segments: { marginTop: spacing.base },
  hintRow: { flexDirection: 'row', alignItems: 'center', columnGap: 6, marginTop: 10 },
  cta: { marginTop: spacing.lg, alignItems: 'center' },
  sectionTitle: { marginBottom: 12 },
  list: { rowGap: spacing.sm },
});

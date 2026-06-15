/**
 * WateringHistoryScreen — the full watering journal: every logged watering,
 * grouped by day. Resolves garden / plant names from cache.
 */

import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';

import { IconButton, Skeleton, Text } from '@components/index';
import { colors, gutter, radii, spacing } from '@theme/index';
import { WateringStackScreenProps } from '@app-types/navigation';
import { useGardens } from '@features/gardens/hooks/useGardens';
import { usePlants } from '@features/plants/hooks/usePlants';
import { useWatering } from '../hooks/useWatering';
import { WateringEmptyState, WateringTimeline } from '../components';

export function WateringHistoryScreen({ navigation }: WateringStackScreenProps<'WateringHistory'>) {
  const insets = useSafeAreaInsets();
  const { data: logs, isLoading } = useWatering();
  const { data: gardens } = useGardens();
  const { data: plants } = usePlants();

  const gardenNames = useMemo(
    () => Object.fromEntries((gardens ?? []).map((g) => [g.id, g.name])),
    [gardens]
  );
  const plantNames = useMemo(
    () => Object.fromEntries((plants ?? []).map((p) => [p.id, p.name])),
    [plants]
  );

  const items = logs ?? [];

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.text.body} />
        </IconButton>
        <Text variant="h2" color="strong">
          Watering history
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
            <Skeleton height={120} radius={radii.lg} />
          </View>
        ) : items.length === 0 ? (
          <WateringEmptyState variant="no-history" />
        ) : (
          <WateringTimeline logs={items} gardenNames={gardenNames} plantNames={plantNames} />
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
  body: { paddingHorizontal: gutter, paddingTop: spacing.sm },
  list: { rowGap: spacing.base },
});

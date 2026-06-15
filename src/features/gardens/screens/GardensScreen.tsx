/**
 * GardensScreen — the Garden tab home. Shows the user's gardens as premium
 * cards (with loading / empty / error states), a "New garden" CTA, pull-to-
 * refresh, and a success banner after create/archive.
 */

import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';

import { Button, Card, Skeleton, Text } from '@components/index';
import { colors, gradients, gutter, palette, radii, spacing } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { useGardens } from '../hooks/useGardens';
import { GardenCard } from '../components/GardenCard';
import { GardenEmptyState } from '../components/GardenEmptyState';
import { FlashBanner } from '../components/FlashBanner';

export function GardensScreen({ navigation, route }: GardensStackScreenProps<'GardensList'>) {
  const insets = useSafeAreaInsets();
  const { data: gardens, isLoading, isError, refetch, isRefetching } = useGardens();
  const [flash, setFlash] = useState<string | undefined>(route.params?.flash);

  useEffect(() => {
    if (route.params?.flash) {
      setFlash(route.params.flash);
      navigation.setParams({ flash: undefined });
    }
  }, [route.params?.flash, navigation]);

  const hasGardens = !!gardens && gardens.length > 0;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => void refetch()} tintColor={palette.green[500]} />
        }
      >
        <LinearGradient
          colors={gradients.meadow.colors}
          start={gradients.meadow.start}
          end={gradients.meadow.end}
          style={[styles.header, { paddingTop: insets.top + 16 }]}
        >
          <Text variant="display" color="strong">My gardens</Text>
          <Text variant="bodyLarge" color="muted" style={styles.helper}>
            {hasGardens
              ? 'Tend, track, and watch them thrive.'
              : 'Your peaceful growing spaces, all in one place.'}
          </Text>
        </LinearGradient>

        <View style={styles.body}>
          {flash ? <FlashBanner message={flash} onDone={() => setFlash(undefined)} /> : null}

          {isLoading ? (
            <View style={styles.list}>
              <Skeleton height={172} radius={radii.lg} />
              <Skeleton height={172} radius={radii.lg} />
            </View>
          ) : isError ? (
            <Card padding="lg" radius="lg">
              <Text variant="h3" color="strong" align="center">We couldn't load your gardens</Text>
              <Text variant="bodySmall" color="muted" align="center" style={styles.errorMsg}>
                Check your connection and try again.
              </Text>
              <Button label="Try again" variant="secondary" onPress={() => void refetch()} style={styles.retry} />
            </Card>
          ) : !hasGardens ? (
            <GardenEmptyState onCreate={() => navigation.navigate('CreateGarden')} />
          ) : (
            <>
              <Button
                label="New garden"
                iconLeft={<Plus size={18} color="#fff" />}
                onPress={() => navigation.navigate('CreateGarden')}
                fullWidth
              />
              <View style={styles.list}>
                {gardens.map((g) => (
                  <GardenCard
                    key={g.id}
                    garden={g}
                    onPress={() => navigation.navigate('GardenDetail', { id: g.id })}
                  />
                ))}
              </View>
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
  errorMsg: { marginTop: 6 },
  retry: { marginTop: spacing.base, alignSelf: 'center' },
});

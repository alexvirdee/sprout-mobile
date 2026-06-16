/**
 * GardenDetailScreen — a single garden: identity header, stat cards, an overview
 * (sun / zone / size / location), placeholder sections for plants & care (Phase
 * 2), seasonal notes, "coming soon" teasers, and edit / archive actions.
 */

import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Archive, ArrowLeft, Droplet, MapPin, SquarePen } from 'lucide-react-native';

import {
  Badge,
  Button,
  Card,
  Emoji,
  IconButton,
  SectionHeader,
  Skeleton,
  Spinner,
  Text,
} from '@components/index';
import { colors, palette, radii, shadows, spacing, gutter } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { useGarden } from '../hooks/useGarden';
import { useArchiveGarden } from '../hooks/useArchiveGarden';
import { GardenStatsCard } from '../components/GardenStatsCard';
import { GardenWeatherCard } from '../components/GardenWeatherCard';
import { FlashBanner } from '../components/FlashBanner';
import {
  ACCENT_COLORS,
  gardenTypeMeta,
  sizeSummary,
  sunExposureMeta,
} from '../types/garden.types';
import { usePlants } from '@features/plants/hooks/usePlants';
import { PlantCard } from '@features/plants/components/PlantCard';
import { PlantEmptyState } from '@features/plants/components/PlantEmptyState';
import { QuickAddPlantModal } from '@features/plants/components/QuickAddPlantModal';
import { useCareTasks } from '@features/care/hooks/useCareTasks';
import { useCompleteCareTask } from '@features/care/hooks/useCareTaskActions';
import { CareTaskList } from '@features/care/components';
import { useJournal } from '@features/journal/hooks/useJournal';
import { JournalTimeline } from '@features/journal/components';

const PHASE_2 = [
  { emoji: '🛏️', label: 'Plant beds' },
  { emoji: '🌦️', label: 'Weather & frost' },
  { emoji: '✨', label: 'AI assistant' },
];

export function GardenDetailScreen({ navigation, route }: GardensStackScreenProps<'GardenDetail'>) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { data: garden, isLoading, isError } = useGarden(id);
  const archive = useArchiveGarden();
  const plantsQuery = usePlants(id);
  const plants = plantsQuery.data ?? [];
  const careTasks = useCareTasks({ status: 'pending', gardenId: id }).data ?? [];
  const completeCare = useCompleteCareTask();
  const journalEntries = useJournal({ gardenId: id }).data ?? [];
  const [quickAdd, setQuickAdd] = useState(false);
  const [flash, setFlash] = useState<string | undefined>(route.params?.flash);

  useEffect(() => {
    if (route.params?.flash) {
      setFlash(route.params.flash);
      navigation.setParams({ flash: undefined });
    }
  }, [route.params?.flash, navigation]);

  const onArchive = () => {
    Alert.alert(
      'Archive this garden?',
      'You can restore this later once archive support is added.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive garden',
          style: 'destructive',
          onPress: () =>
            archive.mutate(id, {
              onSuccess: () => navigation.navigate('GardensList', { flash: 'Garden archived' }),
              onError: () => Alert.alert('Hmm', 'We could not archive that just now. Please try again.'),
            }),
        },
      ],
    );
  };

  const comingSoon = (what: string) => Alert.alert('Coming soon', `${what} arrive in an upcoming update. 🌱`);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />

      <View style={[styles.topbar, { paddingTop: insets.top + 6 }]}>
        <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={colors.text.strong} />
        </IconButton>
        {garden ? (
          <IconButton accessibilityLabel="Edit garden" variant="ghost" onPress={() => navigation.navigate('EditGarden', { id })}>
            <SquarePen size={22} color={colors.text.strong} />
          </IconButton>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>

      {isLoading && !garden ? (
        <View style={styles.center}>
          <Spinner />
        </View>
      ) : isError || !garden ? (
        <View style={styles.center}>
          <Text variant="h2" color="strong">Garden not found</Text>
          <Text variant="bodySmall" color="muted" align="center" style={styles.notFoundMsg}>
            It may have been archived or removed.
          </Text>
          <Button label="Back to gardens" variant="secondary" onPress={() => navigation.navigate('GardensList')} style={styles.notFoundBtn} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: gutter, paddingBottom: insets.bottom + spacing['3xl'] }}
        >
          {flash ? <View style={styles.flash}><FlashBanner message={flash} onDone={() => setFlash(undefined)} /></View> : null}

          {/* Identity */}
          <View style={styles.identity}>
            <LinearGradient
              colors={ACCENT_COLORS[gardenTypeMeta(garden.type).accent].grad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.disc}
            >
              <Emoji size={30}>{gardenTypeMeta(garden.type).emoji}</Emoji>
            </LinearGradient>
            <Text variant="display" color="strong" style={styles.name}>{garden.name}</Text>
            <View style={styles.identityMeta}>
              <Badge label={gardenTypeMeta(garden.type).label} tone="green" />
              {garden.locationLabel ? (
                <View style={styles.loc}>
                  <MapPin size={14} color={colors.text.muted} />
                  <Text variant="bodySmall" color="muted">{garden.locationLabel}</Text>
                </View>
              ) : null}
            </View>
          </View>

          <GardenStatsCard garden={garden} />

          <Button
            label="Water this garden"
            fullWidth
            iconLeft={<Droplet size={18} color={colors.text.onBrand} fill={colors.text.onBrand} />}
            onPress={() => navigation.navigate('Water', { screen: 'LogWatering', params: { gardenId: id } })}
            style={styles.waterCta}
          />

          {garden.latitude != null && garden.longitude != null ? (
            <View style={styles.section}>
              <SectionHeader title="Local weather" />
              <GardenWeatherCard latitude={garden.latitude} longitude={garden.longitude} />
            </View>
          ) : null}

          {/* Overview */}
          <View style={styles.section}>
            <SectionHeader title="Garden overview" />
            <Card padding="none" radius="lg">
              <OverviewRow
                label="Sun exposure"
                value={
                  <View style={styles.sunValue}>
                    <Emoji size={15}>{sunExposureMeta(garden.sunExposure).emoji}</Emoji>
                    <Text variant="title" color="strong">{sunExposureMeta(garden.sunExposure).label}</Text>
                  </View>
                }
              />
              <Divider />
              <OverviewRow label="Growing zone" value={<Value text={garden.growingZone || 'Not set'} />} />
              <Divider />
              <OverviewRow label="Size" value={<Value text={sizeSummary(garden)} />} />
              <Divider />
              <OverviewRow label="City / ZIP" value={<Value text={garden.cityOrZip || 'Not set'} />} />
            </Card>
          </View>

          {/* Plants */}
          <View style={styles.section}>
            <SectionHeader
              title="Plants in this garden"
              actionLabel={plants.length ? 'Add plant' : undefined}
              onActionPress={plants.length ? () => setQuickAdd(true) : undefined}
            />
            {plantsQuery.isLoading ? (
              <Skeleton height={96} radius={radii.lg} />
            ) : plants.length === 0 ? (
              <PlantEmptyState
                title="Nothing planted yet"
                body="Add your first plant so Sprout can help track watering, notes, and growth."
                ctaLabel="Add plant"
                onCta={() => setQuickAdd(true)}
              />
            ) : (
              <View style={styles.plantList}>
                {plants.map((p) => (
                  <PlantCard key={p.id} plant={p} onPress={() => navigation.navigate('PlantDetail', { id: p.id })} />
                ))}
              </View>
            )}
          </View>

          {/* Care schedule */}
          <View style={styles.section}>
            <SectionHeader
              title="Care schedule"
              actionLabel={careTasks.length ? 'See all' : undefined}
              onActionPress={careTasks.length ? () => navigation.navigate('CareCalendar', { gardenId: id }) : undefined}
            />
            {careTasks.length === 0 ? (
              <Placeholder
                emoji="🗓️"
                title="No reminders yet"
                body="Enable care reminders on a plant and they'll show up here."
              />
            ) : (
              <CareTaskList
                tasks={careTasks.slice(0, 3)}
                onPressTask={(t) => navigation.navigate('CareTaskDetail', { id: t.id })}
                onComplete={(t) => completeCare.mutate(t.id)}
              />
            )}
          </View>

          {/* Journal */}
          <View style={styles.section}>
            <SectionHeader
              title="Journal"
              actionLabel={journalEntries.length ? 'See all' : undefined}
              onActionPress={journalEntries.length ? () => navigation.navigate('GardenJournal', { gardenId: id }) : undefined}
            />
            {journalEntries.length === 0 ? (
              <Placeholder
                emoji="🧺"
                title="Start your garden's story"
                body="Log a harvest, jot a note, or mark a milestone — with a photo if you like."
                action={
                  <Button
                    label="Log a harvest"
                    variant="secondary"
                    onPress={() => navigation.navigate('AddJournalEntry', { gardenId: id })}
                  />
                }
              />
            ) : (
              <>
                <JournalTimeline entries={journalEntries.slice(0, 3)} />
                <Button
                  label="Add entry"
                  variant="ghost"
                  fullWidth
                  onPress={() => navigation.navigate('AddJournalEntry', { gardenId: id })}
                  style={styles.addJournalBtn}
                />
              </>
            )}
          </View>

          {/* Seasonal notes */}
          <View style={styles.section}>
            <SectionHeader title="Seasonal notes" />
            <Card padding="md" radius="lg">
              <Text variant="body" color={garden.notes ? 'body' : 'muted'}>
                {garden.notes || 'Add notes about seasons, soil, or plans when you edit this garden.'}
              </Text>
            </Card>
          </View>

          {/* Phase 2 teasers */}
          <View style={styles.section}>
            <SectionHeader title="Coming soon" />
            <View style={styles.phaseGrid}>
              {PHASE_2.map((p) => (
                <Pressable
                  key={p.label}
                  accessibilityRole="button"
                  onPress={() => comingSoon(p.label)}
                  style={styles.phaseCard}
                >
                  <Emoji size={22}>{p.emoji}</Emoji>
                  <Text variant="caption" color="muted" numberOfLines={1} style={styles.flex}>{p.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              label="Edit garden"
              variant="secondary"
              fullWidth
              iconLeft={<SquarePen size={18} color={palette.green[700]} />}
              onPress={() => navigation.navigate('EditGarden', { id })}
            />
            <Button
              label="Archive garden"
              variant="ghost"
              fullWidth
              loading={archive.isPending}
              iconLeft={<Archive size={18} color={colors.status.danger} />}
              onPress={onArchive}
            />
          </View>
        </ScrollView>
      )}

      {garden ? (
        <QuickAddPlantModal
          visible={quickAdd}
          gardenId={garden.id}
          gardenName={garden.name}
          onClose={() => setQuickAdd(false)}
          onAdded={() => {
            setQuickAdd(false);
            setFlash('Plant added 🌱');
          }}
          onAddDetails={(name) => {
            setQuickAdd(false);
            navigation.navigate('AddPlant', { gardenId: garden.id, name });
          }}
        />
      ) : null}
    </View>
  );
}

/* ------------------------------ pieces ------------------------------ */

function OverviewRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <View style={styles.overviewRow}>
      <Text variant="bodySmall" color="muted">{label}</Text>
      {value}
    </View>
  );
}

function Value({ text }: { text: string }) {
  return <Text variant="title" color="strong">{text}</Text>;
}

function Divider() {
  return <View style={styles.divider} />;
}

function Placeholder({
  emoji,
  title,
  body,
  action,
}: {
  emoji: string;
  title: string;
  body: string;
  action?: React.ReactNode;
}) {
  return (
    <Card padding="lg" radius="lg">
      <View style={styles.placeholder}>
        <View style={styles.placeholderDisc}>
          <Emoji size={26}>{emoji}</Emoji>
        </View>
        <Text variant="title" color="strong" align="center">{title}</Text>
        <Text variant="bodySmall" color="muted" align="center">{body}</Text>
        {action ? <View style={styles.placeholderAction}>{action}</View> : null}
      </View>
    </Card>
  );
}

/* ------------------------------ styles ------------------------------ */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  topbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: gutter - 8,
    paddingBottom: 4,
  },
  spacer: { width: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: gutter },
  notFoundMsg: { marginTop: 6 },
  notFoundBtn: { marginTop: spacing.lg },
  flash: { marginBottom: spacing.base },
  waterCta: { marginTop: spacing.lg },

  identity: { alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.lg },
  disc: { width: 72, height: 72, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center', ...shadows.sm },
  name: { marginTop: spacing.md, textAlign: 'center' },
  identityMeta: { flexDirection: 'row', alignItems: 'center', columnGap: 10, marginTop: spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  loc: { flexDirection: 'row', alignItems: 'center', columnGap: 5 },

  section: { marginTop: spacing.xl },
  addJournalBtn: { marginTop: spacing.sm },
  plantList: { rowGap: spacing.base },
  overviewRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  sunValue: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  divider: { height: 1, backgroundColor: colors.border.soft, marginHorizontal: 16 },

  placeholder: { alignItems: 'center', rowGap: 6 },
  placeholderDisc: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: palette.green[50],
    alignItems: 'center', justifyContent: 'center', marginBottom: 4,
  },
  placeholderAction: { marginTop: spacing.base },

  phaseGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  phaseCard: {
    width: '47%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', columnGap: 8,
    paddingHorizontal: 12, paddingVertical: 12,
    backgroundColor: colors.surface.card, borderWidth: 1, borderColor: colors.border.soft, borderRadius: radii.md,
  },
  flex: { flex: 1 },

  actions: { marginTop: spacing['2xl'], rowGap: spacing.sm },
});

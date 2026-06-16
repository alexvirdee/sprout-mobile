/**
 * PlantDetailScreen — a single plant: identity header, quick stats (days since
 * planted / watering / sun / status), a care overview, notes, future-feature
 * placeholders (watering history, photos, harvests, reminders), and edit /
 * archive actions.
 */

import React, { useEffect, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Archive, ArrowLeft, MapPin, SquarePen } from 'lucide-react-native';

import { Badge, Button, Card, Emoji, IconButton, SectionHeader, Spinner, Text } from '@components/index';
import { colors, palette, radii, shadows, spacing, gutter } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { useGardens } from '@features/gardens/hooks/useGardens';
import { FlashBanner } from '@features/gardens/components/FlashBanner';
import { usePlant } from '../hooks/usePlant';
import { useArchivePlant } from '../hooks/useArchivePlant';
import { ACCENT_COLORS } from '../types/plant.types';
import { plantSourceMeta, plantTypeMeta, statusMeta, sunPrefMeta, wateringPrefMeta } from '../utils/plantLabels';
import { daysSincePlanted } from '../utils/plantDates';
import { useCareTasks } from '@features/care/hooks/useCareTasks';
import { useCompleteCareTask } from '@features/care/hooks/useCareTaskActions';
import { CareTaskList } from '@features/care/components';
import { useJournal } from '@features/journal/hooks/useJournal';
import { JournalTimeline } from '@features/journal/components';

const FUTURE = [
  { emoji: '💧', label: 'Watering history' },
  { emoji: '📈', label: 'Growth tracking' },
];

export function PlantDetailScreen({ navigation, route }: GardensStackScreenProps<'PlantDetail'>) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { data: plant, isLoading, isError } = usePlant(id);
  const archive = useArchivePlant();
  const gardens = useGardens().data ?? [];
  const gardenName = plant ? gardens.find((g) => g.id === plant.gardenId)?.name ?? '' : '';
  const careTasks = useCareTasks({ status: 'pending', plantId: id }).data ?? [];
  const completeCare = useCompleteCareTask();
  const journalEntries = useJournal({ plantId: id }).data ?? [];

  const [flash, setFlash] = useState<string | undefined>(route.params?.flash);
  useEffect(() => {
    if (route.params?.flash) {
      setFlash(route.params.flash);
      navigation.setParams({ flash: undefined });
    }
  }, [route.params?.flash, navigation]);

  const onArchive = () => {
    Alert.alert(
      'Archive this plant?',
      'This removes it from your active garden, but keeps the app ready for restore support later.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive plant',
          style: 'destructive',
          onPress: () =>
            archive.mutate(id, {
              onSuccess: (p) => navigation.navigate('GardenDetail', { id: p.gardenId, flash: 'Plant archived' }),
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
        {plant ? (
          <IconButton accessibilityLabel="Edit plant" variant="ghost" onPress={() => navigation.navigate('EditPlant', { id })}>
            <SquarePen size={22} color={colors.text.strong} />
          </IconButton>
        ) : (
          <View style={styles.spacer} />
        )}
      </View>

      {isLoading && !plant ? (
        <View style={styles.center}><Spinner /></View>
      ) : isError || !plant ? (
        <View style={styles.center}>
          <Text variant="h2" color="strong">Plant not found</Text>
          <Text variant="bodySmall" color="muted" align="center" style={styles.notFoundMsg}>It may have been archived or removed.</Text>
          <Button label="Back" variant="secondary" onPress={() => navigation.goBack()} style={styles.notFoundBtn} />
        </View>
      ) : (
        (() => {
          const type = plantTypeMeta(plant.type);
          const accent = ACCENT_COLORS[type.accent];
          const status = statusMeta(plant.status);
          const sun = sunPrefMeta(plant.sunPreference);
          const watering = wateringPrefMeta(plant.wateringPreference);
          const source = plantSourceMeta(plant.source);
          const days = daysSincePlanted(plant.plantedDate);

          return (
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: gutter, paddingBottom: insets.bottom + spacing['3xl'] }}
            >
              {flash ? <View style={styles.flash}><FlashBanner message={flash} onDone={() => setFlash(undefined)} /></View> : null}

              {/* Identity */}
              <View style={styles.identity}>
                <LinearGradient colors={accent.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.disc}>
                  <Emoji size={30}>{type.emoji}</Emoji>
                </LinearGradient>
                <Text variant="display" color="strong" style={styles.name}>{plant.name}</Text>
                {plant.variety ? <Text variant="bodyLarge" color="muted">{plant.variety}</Text> : null}
                <View style={styles.identityMeta}>
                  <Badge label={type.label} tone="green" />
                  {gardenName ? (
                    <View style={styles.loc}>
                      <MapPin size={14} color={colors.text.muted} />
                      <Text variant="bodySmall" color="muted">{gardenName}</Text>
                    </View>
                  ) : null}
                </View>
              </View>

              {/* Stats */}
              <View style={styles.statsGrid}>
                <StatCell soft={palette.green[50]} value={days == null ? '—' : String(days)} label={days === 1 ? 'Day planted' : 'Days planted'} />
                <StatCell soft={palette.terra[50]} value={watering.label} label="Watering" small />
                <StatCell soft={palette.gold[50]} value={sun.label} label="Sun" small />
                <View style={styles.cell}>
                  <Badge label={status.label} tone={status.tone} style={styles.statusBadge} />
                  <Text variant="caption" color="muted">Status</Text>
                </View>
              </View>

              {/* Care overview */}
              <View style={styles.section}>
                <SectionHeader title="Care overview" />
                <Card padding="none" radius="lg">
                  <Row label="Sun" value={<EmojiValue emoji={sun.emoji} text={sun.label} />} />
                  <Divider />
                  <Row label="Watering" value={<EmojiValue emoji={watering.emoji} text={watering.label} />} />
                  <Divider />
                  <Row label="Source" value={<EmojiValue emoji={source.emoji} text={source.label} />} />
                  <Divider />
                  <Row label="Location" value={<Text variant="title" color="strong">{plant.locationInGarden || 'Not set'}</Text>} />
                </Card>
              </View>

              {/* Notes */}
              <View style={styles.section}>
                <SectionHeader title="Notes" />
                <Card padding="md" radius="lg">
                  <Text variant="body" color={plant.notes ? 'body' : 'muted'}>
                    {plant.notes || 'No notes yet — add a few when you edit this plant.'}
                  </Text>
                </Card>
              </View>

              {/* Care reminders */}
              <View style={styles.section}>
                <SectionHeader
                  title="Care reminders"
                  actionLabel={careTasks.length ? 'See all' : undefined}
                  onActionPress={careTasks.length ? () => navigation.navigate('CareCalendar', { gardenId: plant.gardenId }) : undefined}
                />
                {careTasks.length === 0 ? (
                  <Card padding="md" radius="lg">
                    <Text variant="bodySmall" color="muted">
                      No reminders yet. Let Sprout suggest watering, pruning, and seasonal care for {plant.name}.
                    </Text>
                    <Button
                      label="Set up reminders"
                      variant="secondary"
                      onPress={() => navigation.navigate('CareReminderSetup', { plantId: plant.id, gardenId: plant.gardenId })}
                      style={styles.careCta}
                    />
                  </Card>
                ) : (
                  <CareTaskList
                    tasks={careTasks.slice(0, 3)}
                    onPressTask={(t) => navigation.navigate('CareTaskDetail', { id: t.id })}
                    onComplete={(t) => completeCare.mutate(t.id)}
                  />
                )}
              </View>

              {/* Harvests & notes */}
              <View style={styles.section}>
                <SectionHeader
                  title="Harvests & notes"
                  actionLabel={journalEntries.length ? 'See all' : undefined}
                  onActionPress={journalEntries.length ? () => navigation.navigate('GardenJournal', { gardenId: plant.gardenId }) : undefined}
                />
                {journalEntries.length === 0 ? (
                  <Card padding="md" radius="lg">
                    <Text variant="bodySmall" color="muted">
                      Log harvests, notes, and milestones for {plant.name} — with a photo if you like.
                    </Text>
                    <Button
                      label="Log a harvest"
                      variant="secondary"
                      onPress={() => navigation.navigate('AddJournalEntry', { gardenId: plant.gardenId, plantId: plant.id, type: 'harvest' })}
                      style={styles.careCta}
                    />
                  </Card>
                ) : (
                  <>
                    <JournalTimeline entries={journalEntries.slice(0, 3)} />
                    <Button
                      label="Add entry"
                      variant="ghost"
                      fullWidth
                      onPress={() => navigation.navigate('AddJournalEntry', { gardenId: plant.gardenId, plantId: plant.id })}
                      style={styles.addJournalBtn}
                    />
                  </>
                )}
              </View>

              {/* Future */}
              <View style={styles.section}>
                <SectionHeader title="Coming soon" />
                <View style={styles.futureGrid}>
                  {FUTURE.map((f) => (
                    <Pressable key={f.label} accessibilityRole="button" onPress={() => comingSoon(f.label)} style={styles.futureCard}>
                      <Emoji size={22}>{f.emoji}</Emoji>
                      <Text variant="caption" color="muted" numberOfLines={1} style={styles.flex}>{f.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>

              {/* Actions */}
              <View style={styles.actions}>
                <Button label="Edit plant" variant="secondary" fullWidth iconLeft={<SquarePen size={18} color={palette.green[700]} />} onPress={() => navigation.navigate('EditPlant', { id })} />
                <Button label="Archive plant" variant="ghost" fullWidth loading={archive.isPending} iconLeft={<Archive size={18} color={colors.status.danger} />} onPress={onArchive} />
              </View>
            </ScrollView>
          );
        })()
      )}
    </View>
  );
}

function StatCell({ soft, value, label, small }: { soft: string; value: string; label: string; small?: boolean }) {
  return (
    <View style={[styles.cell, { backgroundColor: colors.surface.card }]}>
      <View style={[styles.statChip, { backgroundColor: soft }]} />
      <Text variant={small ? 'title' : 'h1'} color="strong" numberOfLines={1}>{value}</Text>
      <Text variant="caption" color="muted">{label}</Text>
    </View>
  );
}
function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <View style={styles.row}>
      <Text variant="bodySmall" color="muted">{label}</Text>
      {value}
    </View>
  );
}
function EmojiValue({ emoji, text }: { emoji: string; text: string }) {
  return (
    <View style={styles.emojiValue}>
      <Emoji size={15}>{emoji}</Emoji>
      <Text variant="title" color="strong">{text}</Text>
    </View>
  );
}
function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  topbar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: gutter - 8, paddingBottom: 4 },
  spacer: { width: 40 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: gutter },
  notFoundMsg: { marginTop: 6 },
  notFoundBtn: { marginTop: spacing.lg },
  flash: { marginBottom: spacing.base },
  flex: { flex: 1 },

  identity: { alignItems: 'center', paddingTop: spacing.sm, paddingBottom: spacing.lg, rowGap: 4 },
  disc: { width: 72, height: 72, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center', ...shadows.sm, marginBottom: spacing.sm },
  name: { textAlign: 'center' },
  identityMeta: { flexDirection: 'row', alignItems: 'center', columnGap: 10, marginTop: spacing.sm, flexWrap: 'wrap', justifyContent: 'center' },
  loc: { flexDirection: 'row', alignItems: 'center', columnGap: 5 },

  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  cell: {
    width: '47%', flexGrow: 1, rowGap: 6, padding: 16,
    backgroundColor: colors.surface.card, borderWidth: 1, borderColor: colors.border.soft, borderRadius: radii.lg, ...shadows.sm,
  },
  statChip: { width: 30, height: 30, borderRadius: radii.sm },
  statusBadge: { marginTop: 2 },

  section: { marginTop: spacing.xl },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 14 },
  emojiValue: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
  divider: { height: 1, backgroundColor: colors.border.soft, marginHorizontal: 16 },

  futureGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  futureCard: {
    width: '47%', flexGrow: 1, flexDirection: 'row', alignItems: 'center', columnGap: 8,
    paddingHorizontal: 12, paddingVertical: 12,
    backgroundColor: colors.surface.card, borderWidth: 1, borderColor: colors.border.soft, borderRadius: radii.md,
  },
  actions: { marginTop: spacing['2xl'], rowGap: spacing.sm },
  careCta: { marginTop: spacing.base, alignSelf: 'flex-start' },
  addJournalBtn: { marginTop: spacing.sm },
});

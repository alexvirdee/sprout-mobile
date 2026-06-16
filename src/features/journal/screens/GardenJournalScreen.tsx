/**
 * GardenJournalScreen — the full journal timeline for a garden: harvests, notes,
 * and milestones, newest first. Add via the header; long-press an entry to
 * delete. Filterable by type.
 */

import React, { useCallback, useMemo, useState } from 'react';
import { Alert, FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Plus } from 'lucide-react-native';

import { IconButton, SegmentedControl, Spinner, Text } from '@components/index';
import { colors, gutter, spacing } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { useJournal } from '../hooks/useJournal';
import { useDeleteJournalEntry } from '../hooks/useJournalActions';
import { EmptyJournalState, JournalEntryCard } from '../components';
import { JournalEntry } from '../types/journal.types';

type Filter = 'all' | 'harvest' | 'note';

const FILTERS: { value: Filter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'harvest', label: 'Harvests' },
  { value: 'note', label: 'Notes' },
];

export function GardenJournalScreen({ navigation, route }: GardensStackScreenProps<'GardenJournal'>) {
  const { gardenId } = route.params;
  const insets = useSafeAreaInsets();
  const { data: entries = [], isLoading, isRefetching, refetch } = useJournal({ gardenId });
  const del = useDeleteJournalEntry();
  const [filter, setFilter] = useState<Filter>('all');

  const visible = useMemo(
    () => (filter === 'all' ? entries : entries.filter((e) => e.type === filter)),
    [entries, filter]
  );

  const goAdd = () => navigation.navigate('AddJournalEntry', { gardenId });

  const onLongPress = useCallback(
    (entry: JournalEntry) => {
      Alert.alert('Delete this entry?', 'This can’t be undone.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => del.mutate(entry.id) },
      ]);
    },
    [del]
  );

  const renderItem = useCallback(
    ({ item }: { item: JournalEntry }) => (
      <JournalEntryCard entry={item} onLongPress={() => onLongPress(item)} />
    ),
    [onLongPress]
  );

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.text.body} />
        </IconButton>
        <Text variant="h2" color="strong">
          Journal
        </Text>
        <IconButton accessibilityLabel="Add journal entry" variant="ghost" onPress={goAdd}>
          <Plus size={22} color={colors.text.body} />
        </IconButton>
      </View>

      {isLoading ? (
        <View style={styles.center}>
          <Spinner />
        </View>
      ) : (
        <FlatList
          data={visible}
          keyExtractor={(e) => e.id}
          renderItem={renderItem}
          refreshControl={<RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={colors.action.primary} />}
          ListHeaderComponent={
            entries.length > 0 ? (
              <SegmentedControl options={FILTERS} value={filter} onChange={setFilter} size="sm" style={styles.filter} />
            ) : null
          }
          ListEmptyComponent={
            filter === 'all' ? (
              <EmptyJournalState onAdd={goAdd} />
            ) : (
              <Text variant="body" color="muted" align="center" style={styles.noneForFilter}>
                No {filter === 'harvest' ? 'harvests' : 'notes'} yet.
              </Text>
            )
          }
          contentContainerStyle={[
            styles.body,
            visible.length === 0 && styles.bodyEmpty,
            { paddingBottom: insets.bottom + spacing.xl },
          ]}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: gutter - 4,
    paddingBottom: spacing.base,
  },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  body: { paddingHorizontal: gutter, rowGap: 10 },
  bodyEmpty: { flexGrow: 1, justifyContent: 'center' },
  filter: { marginBottom: spacing.base },
  noneForFilter: { marginTop: spacing['2xl'] },
});

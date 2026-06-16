/**
 * CareCalendarScreen — upcoming care, grouped into Today / This week / Later.
 * Optionally scoped to a garden. Tap a task to open it; tap Done to complete.
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';

import { IconButton, Skeleton, Text } from '@components/index';
import { colors, gutter, radii, spacing } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { useCareTasks } from '../hooks/useCareTasks';
import { useCompleteCareTask } from '../hooks/useCareTaskActions';
import { CareTaskList, EmptyCareState } from '../components';
import { CARE_GROUP_LABELS, CareGroup, careGroup } from '../utils/careTaskDates';
import { CareTask } from '../types/care.types';

const GROUP_ORDER: CareGroup[] = ['today', 'week', 'later'];

export function CareCalendarScreen({ navigation, route }: GardensStackScreenProps<'CareCalendar'>) {
  const gardenId = route.params?.gardenId;
  const insets = useSafeAreaInsets();
  const { data: tasks = [], isLoading } = useCareTasks({ status: 'pending', gardenId });
  const complete = useCompleteCareTask();

  const grouped = GROUP_ORDER.map((key) => ({
    key,
    tasks: tasks.filter((t) => careGroup(t.dueDate) === key),
  })).filter((g) => g.tasks.length > 0);

  const onPressTask = (t: CareTask) => navigation.navigate('CareTaskDetail', { id: t.id });
  const onComplete = (t: CareTask) => complete.mutate(t.id);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.text.body} />
        </IconButton>
        <Text variant="h2" color="strong">
          Care calendar
        </Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 40 }]}
      >
        {isLoading ? (
          <View style={styles.list}>
            <Skeleton height={72} radius={radii.lg} />
            <Skeleton height={72} radius={radii.lg} />
          </View>
        ) : tasks.length === 0 ? (
          <EmptyCareState
            variant="no-tasks"
            onAction={() => navigation.navigate('GardensList')}
          />
        ) : (
          grouped.map((g) => (
            <View key={g.key} style={styles.group}>
              <Text variant="eyebrow" color="subtle" style={styles.groupLabel}>
                {CARE_GROUP_LABELS[g.key]}
              </Text>
              <CareTaskList tasks={g.tasks} onPressTask={onPressTask} onComplete={onComplete} />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  topBar: { flexDirection: 'row', alignItems: 'center', columnGap: 8, paddingHorizontal: gutter, paddingBottom: spacing.base },
  spacer: { width: 42 },
  body: { paddingHorizontal: gutter, paddingTop: spacing.sm, rowGap: spacing.lg },
  list: { rowGap: 10 },
  group: { rowGap: 10 },
  groupLabel: { marginLeft: 4 },
});

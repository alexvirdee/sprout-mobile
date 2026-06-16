/**
 * CareTaskDetailScreen — what to do + when, with gentle actions. Opened from a
 * care list or a notification tap.
 */

import React from 'react';
import { Alert, Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, PlayCircle } from 'lucide-react-native';

import { Badge, Button, Card, Emoji, IconButton, SectionHeader, Spinner, Text } from '@components/index';
import { colors, gutter, palette, spacing } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { useGarden } from '@features/gardens/hooks/useGarden';
import { useCareTask } from '../hooks/useCareTasks';
import {
  useCompleteCareTask,
  useDeleteCareTask,
  useRescheduleCareTask,
  useSkipCareTask,
} from '../hooks/useCareTaskActions';
import { CareTaskActions } from '../components';
import { recurrenceLabel, taskTypeMeta } from '../utils/careTaskLabels';
import { dueLabel, dueTone } from '../utils/careTaskDates';

const DAY = 86_400_000;

export function CareTaskDetailScreen({ navigation, route }: GardensStackScreenProps<'CareTaskDetail'>) {
  const { id } = route.params;
  const insets = useSafeAreaInsets();
  const { data: task, isLoading } = useCareTask(id);
  const { data: garden } = useGarden(task?.gardenId ?? '');

  const completeM = useCompleteCareTask();
  const skipM = useSkipCareTask();
  const rescheduleM = useRescheduleCareTask();
  const deleteM = useDeleteCareTask();

  const onComplete = () => completeM.mutate(id, { onSuccess: () => navigation.goBack() });
  const onSkip = () => skipM.mutate(id, { onSuccess: () => navigation.goBack() });
  const onReschedule = () => {
    const at = (days: number) => () => rescheduleM.mutate({ id, dueDate: new Date(Date.now() + days * DAY).toISOString() });
    Alert.alert('Reschedule', 'When should Sprout remind you?', [
      { text: 'Tomorrow', onPress: at(1) },
      { text: 'In 3 days', onPress: at(3) },
      { text: 'Next week', onPress: at(7) },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };
  const onDelete = () =>
    Alert.alert('Delete reminder?', 'This removes the reminder. You can always set it up again.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteM.mutate(id, { onSuccess: () => navigation.goBack() }) },
    ]);

  const header = (
    <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
      <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()}>
        <ArrowLeft size={22} color={colors.text.body} />
      </IconButton>
      <Text variant="h2" color="strong">
        Care task
      </Text>
      <View style={styles.spacer} />
    </View>
  );

  if (isLoading && !task) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <View style={styles.center}>
          <Spinner />
        </View>
      </View>
    );
  }

  if (!task) {
    return (
      <View style={styles.root}>
        <StatusBar style="dark" />
        {header}
        <View style={styles.center}>
          <Text variant="h3" color="strong">This reminder is gone</Text>
          <Text variant="bodySmall" color="muted" align="center" style={styles.notFoundMsg}>
            It may have been completed or removed.
          </Text>
        </View>
      </View>
    );
  }

  const meta = taskTypeMeta(task.taskType);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      {header}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 32 }]}>
        <View style={styles.identity}>
          <View style={styles.disc}>
            <Emoji size={34}>{meta.emoji}</Emoji>
          </View>
          <Text variant="h1" color="strong" align="center" style={styles.title}>
            {task.title}
          </Text>
          <View style={styles.badges}>
            <Badge label={dueLabel(task.dueDate)} tone={dueTone(task.dueDate)} dot />
            {task.recurrence !== 'none' ? (
              <Badge label={recurrenceLabel(task.recurrence, task.recurrenceIntervalDays)} tone="neutral" />
            ) : null}
          </View>
          {garden?.name ? (
            <Text variant="bodySmall" color="muted" style={styles.garden}>
              in {garden.name}
            </Text>
          ) : null}
        </View>

        {task.instructions ? (
          <View style={styles.section}>
            <SectionHeader title="What to do" />
            <Card padding="md" radius="lg">
              <Text variant="body" color="body">
                {task.instructions}
              </Text>
            </Card>
          </View>
        ) : null}

        {task.videoUrl ? (
          <Button
            label="Watch how to"
            variant="secondary"
            fullWidth
            iconLeft={<PlayCircle size={18} color={palette.green[700]} />}
            onPress={() => void Linking.openURL(task.videoUrl as string)}
            style={styles.video}
          />
        ) : null}

        <View style={styles.actions}>
          <CareTaskActions
            onComplete={onComplete}
            onSkip={onSkip}
            onReschedule={onReschedule}
            onDelete={onDelete}
            completing={completeM.isPending}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  topBar: { flexDirection: 'row', alignItems: 'center', columnGap: 8, paddingHorizontal: gutter, paddingBottom: spacing.base },
  spacer: { width: 42 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: gutter },
  notFoundMsg: { marginTop: 6 },
  body: { paddingHorizontal: gutter, paddingTop: spacing.sm },
  identity: { alignItems: 'center', paddingVertical: spacing.lg, rowGap: 10 },
  disc: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.surface.sageSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { marginTop: 4 },
  badges: { flexDirection: 'row', alignItems: 'center', columnGap: 8, flexWrap: 'wrap', justifyContent: 'center' },
  garden: { marginTop: 2 },
  section: { marginTop: spacing.lg },
  video: { marginTop: spacing.lg },
  actions: { marginTop: spacing.xl },
});

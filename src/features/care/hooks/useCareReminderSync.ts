/**
 * useCareReminderSync — keeps scheduled local notifications in sync with the
 * user's upcoming care tasks. Gated by notificationPreferences (push + care
 * reminders). Schedules a notification at ~9am on each task's due date (next 14
 * days, capped), re-syncs on app foreground + when tasks change, and routes a
 * notification tap to the task's detail screen.
 */

import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';

import { useAuthStore } from '@store/authStore';
import {
  cancelNotificationsByType,
  configureNotifications,
  getNotificationPermission,
  scheduleDateNotification,
} from '@services/notifications';
import { navigationRef } from '@/navigation/navigationRef';
import { useCareTasks } from './useCareTasks';
import { taskTypeMeta } from '../utils/careTaskLabels';

const TYPE = 'care-reminder';
const HORIZON_MS = 14 * 86_400_000;
const MAX_SCHEDULED = 10;

/** ~9am on the task's due date. */
function reminderTimeFor(dueDate: string): Date {
  const d = new Date(dueDate);
  d.setHours(9, 0, 0, 0);
  return d;
}

export function useCareReminderSync(): void {
  const isDemo = useAuthStore((s) => s.isDemo);
  const prefs = useAuthStore((s) => s.user?.notificationPreferences);
  const enabled = !isDemo && !!prefs?.pushEnabled && !!prefs?.careTips;
  const { data: tasks } = useCareTasks({ status: 'pending' });

  useEffect(() => {
    configureNotifications();
  }, []);

  const sync = useCallback(async () => {
    await cancelNotificationsByType(TYPE);
    if (!enabled) return;
    if (!(await getNotificationPermission())) return;

    const now = Date.now();
    const upcoming = (tasks ?? [])
      .map((t) => ({ t, when: reminderTimeFor(t.dueDate) }))
      .filter((x) => x.when.getTime() > now + 60_000 && x.when.getTime() <= now + HORIZON_MS)
      .sort((a, b) => a.when.getTime() - b.when.getTime())
      .slice(0, MAX_SCHEDULED);

    for (const { t, when } of upcoming) {
      const meta = taskTypeMeta(t.taskType);
      await scheduleDateNotification({
        date: when,
        title: `${meta.emoji} ${t.title}`,
        body: 'Tap to see what to do.',
        type: TYPE,
        data: { taskId: t.id },
      });
    }
  }, [enabled, tasks]);

  useEffect(() => {
    void sync();
  }, [sync]);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') void sync();
    });
    return () => sub.remove();
  }, [sync]);

  // Tapping a care notification opens that task.
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data = response.notification.request.content.data as { type?: string; taskId?: string };
      if (data?.type === TYPE && data.taskId && navigationRef.isReady()) {
        navigationRef.navigate('Garden', { screen: 'CareTaskDetail', params: { id: data.taskId } });
      }
    });
    return () => sub.remove();
  }, []);
}

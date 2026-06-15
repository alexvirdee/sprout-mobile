/**
 * useWateringReminderSync — keeps the scheduled daily watering reminder in sync
 * with the user's preferences + chosen time slot. Schedules when watering
 * reminders are on (and permission granted), cancels otherwise, and re-syncs
 * when the app returns to the foreground (e.g. after granting permission in
 * Settings). Local + generic by design — the nudge prompts the habit; the app
 * shows live garden state when opened.
 */

import { useCallback, useEffect } from 'react';
import { AppState } from 'react-native';

import { useAuthStore } from '@store/authStore';
import {
  cancelNotificationsByType,
  configureNotifications,
  getNotificationPermission,
  scheduleDailyNotification,
} from '@services/notifications';
import { slotTime, useReminderSettings } from './useReminderSettings';

const TYPE = 'watering-reminder';
const TITLE = 'Time to water 🌿';
const BODY = 'Your garden would love a drink today.';

export function useWateringReminderSync(): void {
  const isDemo = useAuthStore((s) => s.isDemo);
  const prefs = useAuthStore((s) => s.user?.notificationPreferences);
  const slot = useReminderSettings((s) => s.slot);
  const hydrated = useReminderSettings((s) => s.hydrated);
  const hydrate = useReminderSettings((s) => s.hydrate);

  const enabled = !isDemo && !!prefs?.pushEnabled && !!prefs?.wateringReminders;

  useEffect(() => {
    configureNotifications();
    void hydrate();
  }, [hydrate]);

  const sync = useCallback(async () => {
    if (!enabled) {
      await cancelNotificationsByType(TYPE);
      return;
    }
    if (!(await getNotificationPermission())) return; // UI handles asking/explaining
    const { hour, minute } = slotTime(slot);
    await scheduleDailyNotification({ hour, minute, title: TITLE, body: BODY, type: TYPE });
  }, [enabled, slot]);

  useEffect(() => {
    if (hydrated) void sync();
  }, [sync, hydrated]);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (state) => {
      if (state === 'active') void sync();
    });
    return () => subscription.remove();
  }, [sync]);
}

/**
 * notifications — thin wrapper over expo-notifications for LOCAL scheduled
 * reminders (works in Expo Go; no push server needed). Handles the foreground
 * handler, an Android channel, permissions, and scheduling/cancelling daily
 * reminders tagged by `data.type` so a given reminder is a singleton.
 */

import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

let configured = false;

/** Call once when the signed-in app mounts. */
export function configureNotifications(): void {
  if (configured) return;
  configured = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowBanner: true,
      shouldShowList: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  if (Platform.OS === 'android') {
    void Notifications.setNotificationChannelAsync('default', {
      name: 'Sprout reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

function isGranted(status: Notifications.NotificationPermissionsStatus): boolean {
  return (
    status.granted || status.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL
  );
}

export async function getNotificationPermission(): Promise<boolean> {
  return isGranted(await Notifications.getPermissionsAsync());
}

export async function requestNotificationPermission(): Promise<boolean> {
  return isGranted(await Notifications.requestPermissionsAsync());
}

/** Cancel every scheduled notification carrying this `data.type`. */
export async function cancelNotificationsByType(type: string): Promise<void> {
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled
      .filter((n) => (n.content.data as { type?: string } | null)?.type === type)
      .map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier))
  );
}

interface DailyOptions {
  hour: number;
  minute: number;
  title: string;
  body: string;
  type: string;
}

/** Schedule a daily repeating reminder, replacing any existing one of this type. */
export async function scheduleDailyNotification({ hour, minute, title, body, type }: DailyOptions): Promise<void> {
  await cancelNotificationsByType(type);
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: { type } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DAILY, hour, minute },
  });
}

/** Fire a notification right now (used for "send a test reminder"). */
export async function presentNotificationNow(title: string, body: string): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: { title, body, data: { type: 'test' } },
    trigger: null,
  });
}

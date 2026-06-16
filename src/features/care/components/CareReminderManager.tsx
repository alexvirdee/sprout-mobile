/**
 * CareReminderManager — invisible component that keeps care reminders scheduled
 * while the signed-in app is mounted. Render once inside the authed navigator.
 */

import { useCareReminderSync } from '../hooks/useCareReminderSync';

export function CareReminderManager(): null {
  useCareReminderSync();
  return null;
}

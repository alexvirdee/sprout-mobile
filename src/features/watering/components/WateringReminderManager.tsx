/**
 * WateringReminderManager — invisible component that keeps the scheduled
 * watering reminder in sync while the signed-in app is mounted. Render once
 * inside the authenticated navigator.
 */

import { useWateringReminderSync } from '../hooks/useWateringReminderSync';

export function WateringReminderManager(): null {
  useWateringReminderSync();
  return null;
}

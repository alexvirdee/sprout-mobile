/**
 * useReminderSettings — device-local watering-reminder time slot (notifications
 * are per-device, so this lives in SecureStore, not the user record). The
 * on/off switch itself is the server-synced `notificationPreferences.wateringReminders`.
 */

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';

export type ReminderSlot = 'morning' | 'midday' | 'evening';

export interface ReminderSlotOption {
  value: ReminderSlot;
  label: string;
  time: string;
  hour: number;
  minute: number;
}

export const REMINDER_SLOTS: ReminderSlotOption[] = [
  { value: 'morning', label: 'Morning', time: '8:00 AM', hour: 8, minute: 0 },
  { value: 'midday', label: 'Midday', time: '12:00 PM', hour: 12, minute: 0 },
  { value: 'evening', label: 'Evening', time: '5:00 PM', hour: 17, minute: 0 },
];

export function slotTime(slot: ReminderSlot): ReminderSlotOption {
  return REMINDER_SLOTS.find((s) => s.value === slot) ?? REMINDER_SLOTS[0];
}

const KEY = 'sprout.reminderSlot';

interface ReminderState {
  slot: ReminderSlot;
  hydrated: boolean;
  hydrate: () => Promise<void>;
  setSlot: (slot: ReminderSlot) => Promise<void>;
}

export const useReminderSettings = create<ReminderState>((set) => ({
  slot: 'morning',
  hydrated: false,
  hydrate: async () => {
    try {
      const saved = await SecureStore.getItemAsync(KEY);
      if (saved === 'morning' || saved === 'midday' || saved === 'evening') set({ slot: saved });
    } catch {
      /* ignore — fall back to default slot */
    }
    set({ hydrated: true });
  },
  setSlot: async (slot) => {
    set({ slot });
    try {
      await SecureStore.setItemAsync(KEY, slot);
    } catch {
      /* ignore persistence failure */
    }
  },
}));

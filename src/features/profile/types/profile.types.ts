/**
 * Profile / account-center types. The User shape itself lives in @app-types/models
 * (it flows through the auth store); this module covers the derived stats,
 * achievements, and update payloads specific to the profile feature.
 */

import { NotificationPreferences, ThemePreference } from '@app-types/models';

export type { NotificationPreferences, ThemePreference };

export interface ProfileStats {
  gardens: number;
  plants: number;
  wateringSessions: number;
  harvests: number;
  /** Actual harvest events recorded in the journal. */
  harvestLogs: number;
  tasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  memberSince: string | null;
}

export type AchievementTone = 'green' | 'gold' | 'terra' | 'sage';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  tone: AchievementTone;
  unlocked: boolean;
  unlockedAt: string | null;
}

export interface AchievementsResponse {
  achievements: Achievement[];
  unlockedCount: number;
  total: number;
}

export interface UpdateProfilePayload {
  name?: string;
  displayName?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  location?: string;
  /** Image URI or URL; null removes the avatar. */
  avatar?: string | null;
  email?: string;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  pushEnabled: true,
  wateringReminders: true,
  careTips: true,
  seasonalTips: true,
  achievements: true,
};

export interface NotificationOption {
  key: keyof NotificationPreferences;
  label: string;
  hint: string;
}

/** The notification toggles, in display order. Reminder scheduling is Phase 2. */
export const NOTIFICATION_OPTIONS: NotificationOption[] = [
  { key: 'pushEnabled', label: 'Push notifications', hint: 'Allow Sprout to send you notifications' },
  { key: 'wateringReminders', label: 'Watering reminders', hint: 'Gentle nudges when a garden needs water' },
  { key: 'careTips', label: 'Garden care tips', hint: 'Helpful, timely advice for your plants' },
  { key: 'seasonalTips', label: 'Seasonal tips', hint: "What to plant and tend as the seasons turn" },
  { key: 'achievements', label: 'Achievements', hint: 'Celebrate milestones as you reach them' },
];

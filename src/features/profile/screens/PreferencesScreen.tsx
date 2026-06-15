/**
 * PreferencesScreen — functional notification toggles, a watering-reminder
 * schedule (daily local notification), and appearance (theme) selection. Every
 * change persists optimistically. Turning off push disables dependent toggles.
 * Enabling push / watering reminders requests notification permission.
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Award, Bell, Droplets, Leaf, Sun } from 'lucide-react-native';

import { Button, Card, IconButton, SectionHeader, SegmentedControl, Text } from '@components/index';
import { colors, gutter, palette, spacing } from '@theme/index';
import { ProfileStackScreenProps } from '@app-types/navigation';
import { NotificationPreferences, ThemePreference } from '@app-types/models';
import {
  getNotificationPermission,
  presentNotificationNow,
  requestNotificationPermission,
} from '@services/notifications';
import { REMINDER_SLOTS, ReminderSlot, slotTime, useReminderSettings } from '@features/watering/hooks/useReminderSettings';
import { useProfile } from '../hooks/useProfile';
import { useNotificationPreferences } from '../hooks/useNotificationPreferences';
import { useUpdateTheme } from '../hooks/useUpdateTheme';
import { PreferenceToggle, SettingDivider } from '../components';
import { NOTIFICATION_OPTIONS } from '../types/profile.types';

const NOTIF_ICONS = {
  pushEnabled: Bell,
  wateringReminders: Droplets,
  careTips: Leaf,
  seasonalTips: Sun,
  achievements: Award,
} as const;

const THEME_OPTIONS: { value: ThemePreference; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

const SLOT_OPTIONS = REMINDER_SLOTS.map((s) => ({ value: s.value, label: s.label }));

export function PreferencesScreen({ navigation }: ProfileStackScreenProps<'Preferences'>) {
  const insets = useSafeAreaInsets();
  const { user } = useProfile();
  const { prefs, toggle } = useNotificationPreferences();
  const updateTheme = useUpdateTheme();
  const theme = user?.themePreference ?? 'system';

  const slot = useReminderSettings((s) => s.slot);
  const setSlot = useReminderSettings((s) => s.setSlot);

  const [permission, setPermission] = useState<boolean | null>(null);
  useEffect(() => {
    void getNotificationPermission().then(setPermission);
  }, []);

  const ensurePermission = useCallback(async () => {
    if (permission) return true;
    const granted = await requestNotificationPermission();
    setPermission(granted);
    return granted;
  }, [permission]);

  const onToggle = async (key: keyof NotificationPreferences, value: boolean) => {
    // Ask for permission when switching reminders on; save the choice either way.
    if (value && (key === 'pushEnabled' || key === 'wateringReminders')) {
      await ensurePermission();
    }
    toggle(key, value);
  };

  const onTestReminder = async () => {
    if (!(await ensurePermission())) {
      Alert.alert('Notifications are off', 'Enable notifications for Sprout to receive reminders.');
      return;
    }
    await presentNotificationNow('Time to water 🌿', 'This is how your daily reminder will look.');
    Alert.alert('Sent!', 'Check your notifications for a sample reminder.');
  };

  const remindersOn = prefs.pushEnabled && prefs.wateringReminders;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.text.body} />
        </IconButton>
        <Text variant="h2" color="strong">
          Preferences
        </Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 40 }]}
      >
        <View>
          <SectionHeader title="Notifications" />
          <Card padding="none" elevation="sm" radius="lg">
            {NOTIFICATION_OPTIONS.map((opt, i) => {
              const Icon = NOTIF_ICONS[opt.key];
              const dependent = opt.key !== 'pushEnabled';
              return (
                <React.Fragment key={opt.key}>
                  {i > 0 ? <SettingDivider /> : null}
                  <PreferenceToggle
                    icon={<Icon size={18} color={palette.green[700]} />}
                    label={opt.label}
                    hint={opt.hint}
                    value={prefs[opt.key]}
                    onValueChange={(v) => void onToggle(opt.key, v)}
                    disabled={dependent && !prefs.pushEnabled}
                  />
                </React.Fragment>
              );
            })}
          </Card>
          <Text variant="caption" color="subtle" style={styles.note}>
            Watering reminders arrive as a gentle daily nudge. Other categories are saved for upcoming updates.
          </Text>
        </View>

        {remindersOn ? (
          <View>
            <SectionHeader title="Watering reminder" />
            <Card padding="md" elevation="sm" radius="lg">
              <Text variant="bodySmall" color="muted">
                When should we nudge you to water?
              </Text>
              <SegmentedControl
                options={SLOT_OPTIONS}
                value={slot}
                onChange={(v: ReminderSlot) => void setSlot(v)}
                style={styles.reminderSegments}
              />
              <Text variant="caption" color="subtle" style={styles.slotTime}>
                Daily at {slotTime(slot).time}
              </Text>

              {permission === false ? (
                <View style={styles.permRow}>
                  <Text variant="bodySmall" color="warning" style={styles.flex}>
                    Notifications are off for Sprout.
                  </Text>
                  <Button label="Enable" size="sm" variant="secondary" onPress={() => void ensurePermission()} />
                </View>
              ) : (
                <Button
                  label="Send a test reminder"
                  size="sm"
                  variant="secondary"
                  onPress={() => void onTestReminder()}
                  style={styles.testBtn}
                />
              )}
            </Card>
          </View>
        ) : null}

        <View>
          <SectionHeader title="Appearance" />
          <Card padding="md" elevation="sm" radius="lg">
            <Text variant="bodySmall" color="muted" style={styles.appearanceMsg}>
              Choose how Sprout looks. "System" follows your device.
            </Text>
            <SegmentedControl
              options={THEME_OPTIONS}
              value={theme}
              onChange={(v) => updateTheme.mutate(v)}
              style={styles.segments}
            />
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    paddingHorizontal: gutter,
    paddingBottom: spacing.base,
  },
  spacer: { width: 42 },
  flex: { flex: 1 },
  body: { paddingHorizontal: gutter, paddingTop: spacing.sm, rowGap: spacing.lg },
  note: { marginTop: 8, marginLeft: 4 },
  reminderSegments: { marginTop: spacing.base, alignSelf: 'flex-start' },
  slotTime: { marginTop: 10 },
  permRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12, marginTop: spacing.base },
  testBtn: { marginTop: spacing.base, alignSelf: 'flex-start' },
  appearanceMsg: { marginBottom: spacing.base },
  segments: { alignSelf: 'flex-start' },
});

/**
 * PreferencesScreen — functional notification toggles + appearance (theme)
 * selection. Every change persists optimistically. Notification *scheduling* is
 * Phase 2; this is the settings architecture that will drive it. Turning off
 * push disables the dependent reminder toggles.
 */

import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, Award, Bell, Droplets, Leaf, Sun } from 'lucide-react-native';

import { Card, IconButton, SectionHeader, SegmentedControl, Text } from '@components/index';
import { colors, gutter, palette, spacing } from '@theme/index';
import { ProfileStackScreenProps } from '@app-types/navigation';
import { ThemePreference } from '@app-types/models';
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

export function PreferencesScreen({ navigation }: ProfileStackScreenProps<'Preferences'>) {
  const insets = useSafeAreaInsets();
  const { user } = useProfile();
  const { prefs, toggle } = useNotificationPreferences();
  const updateTheme = useUpdateTheme();
  const theme = user?.themePreference ?? 'system';

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
                    onValueChange={(v) => toggle(opt.key, v)}
                    disabled={dependent && !prefs.pushEnabled}
                  />
                </React.Fragment>
              );
            })}
          </Card>
          <Text variant="caption" color="subtle" style={styles.note}>
            Reminder delivery is coming soon — your choices here are saved and ready.
          </Text>
        </View>

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
  body: { paddingHorizontal: gutter, paddingTop: spacing.sm, rowGap: spacing.lg },
  note: { marginTop: 8, marginLeft: 4 },
  appearanceMsg: { marginBottom: spacing.base },
  segments: { alignSelf: 'flex-start' },
});

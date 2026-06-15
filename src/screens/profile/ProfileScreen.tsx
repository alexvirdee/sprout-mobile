/**
 * ProfileScreen — the "You" tab. A warm personal dashboard: identity header,
 * a watering-streak hero, garden stats, achievement badges, and preferences.
 *
 * Identity is real (useAuth); streaks/achievements/preferences are mock for now,
 * following the same "mock today, API tomorrow" pattern as the Home dashboard.
 */

import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Award,
  Bell,
  ChevronRight,
  Droplets,
  Flame,
  Info,
  Leaf,
  LogOut,
  Moon,
  Pencil,
  ShoppingBasket,
  Sprout,
} from 'lucide-react-native';

import {
  AchievementBadge,
  Avatar,
  Badge,
  Button,
  Card,
  ProgressRing,
  SectionHeader,
  StatTile,
  Switch,
  Text,
} from '@components/index';
import { colors, gradients, gutter, palette, radii, spacing } from '@theme/index';
import { useAuth } from '@hooks/useAuth';
import { firstName } from '@utils/format';

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function memberSinceLabel(iso?: string): string | undefined {
  if (!iso) return undefined;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return undefined;
  return `Member since ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

/** Mock profile metrics — swap for an API-backed hook in Phase 2. */
const STREAK = { current: 7, goal: 14 };
const STATS = { plantsGrowing: 24, harvested: '18 lb', tasksDone: 92 };

type BadgeTone = 'green' | 'gold' | 'terra' | 'sage';
const ACHIEVEMENTS: {
  id: string;
  icon: string;
  title: string;
  caption: string;
  tone: BadgeTone;
  unlocked: boolean;
}[] = [
  { id: 'a1', icon: '🌱', title: 'First sprout', caption: 'Planted #1', tone: 'green', unlocked: true },
  { id: 'a2', icon: '🔥', title: 'Week streak', caption: '7 days', tone: 'gold', unlocked: true },
  { id: 'a3', icon: '🍅', title: 'First harvest', caption: 'Sungolds', tone: 'terra', unlocked: true },
  { id: 'a4', icon: '🌻', title: 'Green thumb', caption: '25 plants', tone: 'sage', unlocked: false },
  { id: 'a5', icon: '🏆', title: 'Master gardener', caption: 'Season 1', tone: 'gold', unlocked: false },
];

export function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { user, isDemo, logout } = useAuth();

  const name = user?.name ?? 'Friend';
  const since = memberSinceLabel(user?.createdAt);
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlocked).length;

  const [notifications, setNotifications] = useState(true);
  const [wateringReminders, setWateringReminders] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
      >
        {/* Identity header */}
        <LinearGradient
          colors={gradients.meadow.colors}
          start={gradients.meadow.start}
          end={gradients.meadow.end}
          style={[styles.header, { paddingTop: insets.top + spacing.xl }]}
        >
          <Avatar name={name} source={user?.avatar} size="xl" ring />
          <Text variant="h1" color="strong" align="center" style={{ marginTop: spacing.md }}>
            {name}
          </Text>
          {user?.email ? (
            <Text variant="body" color="muted" align="center" style={{ marginTop: 2 }}>
              {user.email}
            </Text>
          ) : null}
          {isDemo ? (
            <View style={styles.headerMeta}>
              <Badge label="Demo mode" tone="gold" dot />
            </View>
          ) : since ? (
            <Text variant="caption" color="subtle" align="center" style={{ marginTop: 8 }}>
              {since}
            </Text>
          ) : null}
        </LinearGradient>

        <View style={styles.body}>
          {/* Streak hero */}
          <Card padding="md" elevation="sm" radius="lg">
            <View style={styles.streakRow}>
              <ProgressRing
                value={STREAK.current}
                max={STREAK.goal}
                label={String(STREAK.current)}
                sublabel="days"
                tone="gold"
                size={92}
              />
              <View style={styles.streakText}>
                <View style={styles.streakTitleRow}>
                  <Flame size={16} color={palette.gold[600]} />
                  <Text variant="eyebrow" tint={palette.gold[700]}>
                    Watering streak
                  </Text>
                </View>
                <Text variant="h2" color="strong" style={{ marginTop: 4 }}>
                  {STREAK.current}-day streak
                </Text>
                <Text variant="bodySmall" color="muted" style={{ marginTop: 4 }}>
                  {STREAK.goal - STREAK.current} more days to beat your record, {firstName(name)}.
                </Text>
              </View>
            </View>
          </Card>

          {/* Stat grid */}
          <View style={styles.statsRow}>
            <StatTile
              icon={<Leaf size={18} color={palette.green[700]} />}
              value={String(STATS.plantsGrowing)}
              label="Growing"
              tone="green"
              style={styles.statTile}
            />
            <StatTile
              icon={<ShoppingBasket size={18} color={palette.gold[700]} />}
              value={STATS.harvested}
              label="Harvested"
              tone="gold"
              style={styles.statTile}
            />
          </View>
          <View style={styles.statsRow}>
            <StatTile
              icon={<Award size={18} color={palette.terra[600]} />}
              value={String(unlockedCount)}
              label="Badges"
              tone="terra"
              style={styles.statTile}
            />
            <StatTile
              icon={<Sprout size={18} color={palette.sageScale[700]} />}
              value={`${STATS.tasksDone}%`}
              label="Tasks done"
              tone="sage"
              style={styles.statTile}
            />
          </View>

          {/* Achievements */}
          <View>
            <SectionHeader title="Achievements" />
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.badgeRow}
            >
              {ACHIEVEMENTS.map((a) => (
                <AchievementBadge
                  key={a.id}
                  icon={a.icon}
                  title={a.title}
                  caption={a.caption}
                  tone={a.tone}
                  unlocked={a.unlocked}
                  size={84}
                />
              ))}
            </ScrollView>
          </View>

          {/* Preferences */}
          <View>
            <SectionHeader title="Preferences" />
            <Card padding="none" elevation="sm" radius="lg">
              <SettingRow
                icon={<Pencil size={18} color={palette.green[700]} />}
                label="Edit profile"
                onPress={() => undefined}
              />
              <Divider />
              <SettingRow
                icon={<Bell size={18} color={palette.green[700]} />}
                label="Notifications"
                control={<Switch value={notifications} onValueChange={setNotifications} />}
              />
              <Divider />
              <SettingRow
                icon={<Droplets size={18} color={palette.terra[600]} />}
                label="Watering reminders"
                control={<Switch value={wateringReminders} onValueChange={setWateringReminders} />}
              />
              <Divider />
              <SettingRow
                icon={<Moon size={18} color={palette.sageScale[700]} />}
                label="Dark mode"
                control={<Switch value={darkMode} onValueChange={setDarkMode} />}
              />
              <Divider />
              <SettingRow
                icon={<Info size={18} color={colors.text.muted} />}
                label="About Sprout"
                onPress={() => undefined}
              />
            </Card>
          </View>

          {/* Sign out + footer */}
          <Button
            label="Sign out"
            variant="secondary"
            fullWidth
            iconLeft={<LogOut size={18} color={palette.green[700]} />}
            onPress={() => void logout()}
          />
          <Text variant="caption" color="subtle" align="center" style={{ marginTop: spacing.md }}>
            Sprout v0.1.0 · Watching your garden thrive
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* ------------------------------ pieces ------------------------------ */

function SettingRow({
  icon,
  label,
  control,
  onPress,
}: {
  icon: React.ReactNode;
  label: string;
  control?: React.ReactNode;
  onPress?: () => void;
}) {
  const content = (
    <View style={styles.settingRow}>
      <View style={styles.settingIcon}>{icon}</View>
      <Text variant="title" color="strong" style={styles.settingLabel}>
        {label}
      </Text>
      {control ?? <ChevronRight size={20} color={colors.text.subtle} />}
    </View>
  );

  if (control) return content;
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.rowPressed : undefined)}
    >
      {content}
    </Pressable>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

/* ------------------------------ styles ------------------------------ */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  header: {
    alignItems: 'center',
    paddingHorizontal: gutter,
    paddingBottom: spacing.xl,
  },
  headerMeta: { marginTop: spacing.md },

  body: { paddingHorizontal: gutter, paddingTop: spacing.lg, rowGap: spacing.lg },

  streakRow: { flexDirection: 'row', alignItems: 'center', columnGap: spacing.lg },
  streakText: { flex: 1 },
  streakTitleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },

  statsRow: { flexDirection: 'row', columnGap: 12 },
  statTile: { flex: 1 },

  badgeRow: { columnGap: 4, paddingVertical: 2, paddingRight: spacing.lg },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 14,
    paddingHorizontal: 16,
    paddingVertical: 15,
  },
  settingIcon: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    backgroundColor: colors.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingLabel: { flex: 1 },
  rowPressed: { backgroundColor: colors.surface.sunken },
  divider: { height: 1, backgroundColor: colors.border.soft, marginLeft: 64 },
});

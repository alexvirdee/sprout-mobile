/**
 * DashboardScreen — the premium Home. Greeting header, garden health ring,
 * watering nudge, stat tiles, today's tasks, the plant grid, recent harvests,
 * and a seasonal tip. Data comes from useDashboard (mock today, API tomorrow).
 */

import React, { useEffect, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { Droplet, Leaf, ShoppingBasket } from 'lucide-react-native';

import {
  Avatar,
  Badge,
  Card,
  Checkbox,
  PlantCard,
  ProgressRing,
  SectionHeader,
  Skeleton,
  StatTile,
  Text,
} from '@components/index';
import { colors, gradients, gutter, palette, radii, shadows, spacing } from '@theme/index';
import { useDashboard } from '@hooks/useDashboard';
import { useAuth } from '@hooks/useAuth';
import { firstName, greeting } from '@utils/format';
import { DashboardData, PlantSummary, TaskItem } from '@features/garden/types';
import { AppTabScreenProps } from '@app-types/navigation';

export function DashboardScreen({ navigation }: AppTabScreenProps<'Home'>) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { data, isLoading } = useDashboard();
  const { width } = useWindowDimensions();

  const cardWidth = (width - gutter * 2 - 12) / 2;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 96 }}
      >
        <Header name={user?.name ?? 'friend'} avatar={user?.avatar} topInset={insets.top} />

        <View style={styles.body}>
          {isLoading || !data ? (
            <LoadingBody />
          ) : (
            <>
              <HealthCard data={data} />
              <WateringCard
                count={data.watering.count}
                note={data.watering.note}
                onPress={() => navigation.navigate('Water')}
              />

              <View style={styles.statsRow}>
                <StatTile
                  icon={<Leaf size={18} color={palette.green[700]} />}
                  value={String(data.stats.plantsGrowing)}
                  label="Growing"
                  delta={data.stats.growingDelta}
                  tone="green"
                  style={styles.statTile}
                />
                <StatTile
                  icon={<ShoppingBasket size={18} color={palette.gold[700]} />}
                  value={data.stats.harvestedLabel}
                  label="Harvested"
                  tone="gold"
                  style={styles.statTile}
                />
              </View>

              <View>
                <SectionHeader title="Today's tasks" />
                <TasksCard tasks={data.tasks} />
              </View>

              <View>
                <SectionHeader title="My plants" actionLabel="See all" onActionPress={() => navigation.navigate('Garden')} />
                <View style={styles.grid}>
                  {data.plants.map((plant) => (
                    <PlantCard
                      key={plant.id}
                      name={plant.name}
                      variety={plant.variety}
                      location={plant.location}
                      emoji={plant.emoji}
                      status={plant.status}
                      progress={plant.progress}
                      onPress={() => navigation.navigate('Garden')}
                      style={{ width: cardWidth }}
                    />
                  ))}
                </View>
              </View>

              <View>
                <SectionHeader title="Recent harvests" />
                <HarvestRow data={data} />
              </View>

              <SeasonalCard data={data} />
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

/* ----------------------------- sections ----------------------------- */

function Header({ name, avatar, topInset }: { name: string; avatar?: string; topInset: number }) {
  return (
    <LinearGradient
      colors={gradients.dawn.colors}
      start={gradients.dawn.start}
      end={gradients.dawn.end}
      style={[styles.header, { paddingTop: topInset + 14 }]}
    >
      <View style={styles.headerRow}>
        <View style={{ flex: 1 }}>
          <Text variant="bodySmall" color="muted">
            {greeting()}, {firstName(name)} 🌤️
          </Text>
          <Text variant="display" color="strong" style={styles.headerTitle}>
            Your garden
          </Text>
        </View>
        <Avatar name={name} source={avatar} size="md" ring />
      </View>
    </LinearGradient>
  );
}

function HealthCard({ data }: { data: DashboardData }) {
  return (
    <Card padding="md" elevation="sm" radius="lg">
      <View style={styles.healthRow}>
        <ProgressRing value={data.healthScore} label={String(data.healthScore)} sublabel="score" tone="green" size={96} />
        <View style={styles.healthText}>
          <Text variant="eyebrow" tint={palette.green[700]}>
            Garden health
          </Text>
          <Text variant="h2" color="strong" style={{ marginTop: 4 }}>
            {data.healthLabel}
          </Text>
          <Text variant="bodySmall" color="muted" style={{ marginTop: 4 }}>
            Everything's looking lush — a few plants would love a drink today.
          </Text>
        </View>
      </View>
    </Card>
  );
}

function WateringCard({ count, note, onPress }: { count: number; note: string; onPress: () => void }) {
  return (
    <Card padding="sm" elevation="sm" radius="lg" onPress={onPress}>
      <View style={styles.wateringRow}>
        <View style={styles.dropChip}>
          <Droplet size={22} color={palette.terra[600]} />
        </View>
        <View style={{ flex: 1 }}>
          <Text variant="title" color="strong">
            {count} plants need water
          </Text>
          <Text variant="bodySmall" color="muted">
            {note}
          </Text>
        </View>
        <Badge label="Today" tone="terra" />
      </View>
    </Card>
  );
}

function TasksCard({ tasks }: { tasks: TaskItem[] }) {
  const [items, setItems] = useState(tasks);
  useEffect(() => setItems(tasks), [tasks]);
  const toggle = (id: string) =>
    setItems((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));

  return (
    <Card padding="md" elevation="sm" radius="lg">
      <View style={styles.taskList}>
        {items.map((task) => (
          <Checkbox key={task.id} checked={task.completed} onChange={() => toggle(task.id)} label={task.title} />
        ))}
      </View>
    </Card>
  );
}

function HarvestRow({ data }: { data: DashboardData }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.harvestRow}
    >
      {data.recentHarvests.map((h) => (
        <View key={h.id} style={styles.harvestCard}>
          <View style={styles.harvestDisc}>
            <Text style={{ fontSize: 26 }}>{h.emoji}</Text>
          </View>
          <Text variant="label" color="strong" numberOfLines={1}>
            {h.name}
          </Text>
          <Text variant="caption" color="muted">
            {h.amount} · {h.when}
          </Text>
        </View>
      ))}
    </ScrollView>
  );
}

function SeasonalCard({ data }: { data: DashboardData }) {
  return (
    <LinearGradient
      colors={gradients.sun.colors}
      start={gradients.sun.start}
      end={gradients.sun.end}
      style={styles.seasonal}
    >
      <Text variant="eyebrow" tint={palette.gold[700]}>
        {data.seasonalTip.eyebrow}
      </Text>
      <Text variant="h2" color="strong" style={{ marginTop: 6 }}>
        {data.seasonalTip.title}
      </Text>
      <Text variant="body" color="muted" style={{ marginTop: 6 }}>
        {data.seasonalTip.body}
      </Text>
    </LinearGradient>
  );
}

function LoadingBody() {
  return (
    <View style={{ rowGap: spacing.lg }}>
      <Skeleton height={120} radius={radii.lg} />
      <Skeleton height={72} radius={radii.lg} />
      <View style={styles.statsRow}>
        <Skeleton height={108} radius={radii.lg} style={{ flex: 1 }} />
        <Skeleton height={108} radius={radii.lg} style={{ flex: 1 }} />
      </View>
      <Skeleton height={160} radius={radii.lg} />
    </View>
  );
}

/* ------------------------------ styles ------------------------------ */

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  header: {
    paddingHorizontal: gutter,
    paddingBottom: spacing.lg,
  },
  headerRow: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  headerTitle: { marginTop: 2 },
  body: { paddingHorizontal: gutter, paddingTop: spacing.base, rowGap: spacing.lg },

  healthRow: { flexDirection: 'row', alignItems: 'center', columnGap: spacing.lg },
  healthText: { flex: 1 },

  wateringRow: { flexDirection: 'row', alignItems: 'center', columnGap: spacing.md },
  dropChip: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: palette.terra[100],
    alignItems: 'center',
    justifyContent: 'center',
  },

  statsRow: { flexDirection: 'row', columnGap: 12 },
  statTile: { flex: 1 },

  taskList: { rowGap: 14 },

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  harvestRow: { columnGap: 12, paddingVertical: 2 },
  harvestCard: {
    width: 132,
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.soft,
    borderRadius: radii.lg,
    padding: 14,
    rowGap: 4,
    ...shadows.sm,
  },
  harvestDisc: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: palette.gold[50],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },

  seasonal: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: palette.gold[100],
  },
});

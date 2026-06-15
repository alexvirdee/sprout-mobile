/**
 * WeatherCard — the prominent "today's weather" card. Handles every state:
 * loading (skeleton), granted+data (temp, condition, high/low, rain%, mood +
 * gardening recommendation), permission denied (Enable CTA / Maybe later), and
 * unavailable / error (gentle fallback). Never blocks the screen.
 */

import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, MapPin } from 'lucide-react-native';

import { Badge, Button, Card, Emoji, Skeleton, Text } from '@components/index';
import { colors, palette, radii, spacing } from '@theme/index';
import { CurrentWeather } from '@features/weather/types/weather.types';
import { LocationStatus } from '@features/weather/hooks/useDeviceLocation';
import { weatherMood, weatherRecommendation } from '@features/weather/utils/weatherRecommendations';

const SKY_GRADIENT = ['#E6EEF5', '#F4F7F3'] as const;

export interface WeatherCardProps {
  status: LocationStatus;
  weather?: CurrentWeather;
  isLoading: boolean;
  isError: boolean;
  onEnable: () => void;
}

export function WeatherCard({ status, weather, isLoading, isError, onEnable }: WeatherCardProps) {
  const [minimized, setMinimized] = useState(false);

  if (status === 'loading' || (status === 'granted' && isLoading && !weather)) {
    return <Skeleton height={172} radius={radii.xl} />;
  }

  if (status === 'denied') {
    if (minimized) {
      return (
        <Pressable onPress={onEnable} accessibilityRole="button">
          <Card padding="sm" radius="lg">
            <View style={styles.minRow}>
              <MapPin size={18} color={palette.green[700]} />
              <Text variant="label" tint={palette.green[700]} style={styles.flex}>Enable weather for local care tips</Text>
              <ChevronRight size={18} color={colors.text.subtle} />
            </View>
          </Card>
        </Pressable>
      );
    }
    return (
      <Card padding="md" radius="xl">
        <Emoji size={32}>⛅</Emoji>
        <Text variant="h3" color="strong" style={styles.permTitle}>See your local garden weather</Text>
        <Text variant="bodySmall" color="muted" style={styles.permMsg}>
          Weather helps Sprout make better care suggestions for your gardens.
        </Text>
        <View style={styles.permActions}>
          <Button label="Enable weather" onPress={onEnable} />
          <Button label="Maybe later" variant="ghost" onPress={() => setMinimized(true)} />
        </View>
      </Card>
    );
  }

  if (status === 'unavailable' || isError || !weather) {
    return (
      <Card padding="md" radius="xl">
        <Emoji size={32}>🌥️</Emoji>
        <Text variant="h3" color="strong" style={styles.permTitle}>Weather is taking a little break</Text>
        <Text variant="bodySmall" color="muted" style={styles.permMsg}>
          You can still manage your gardens — we'll bring the forecast back soon.
        </Text>
      </Card>
    );
  }

  const tip = weatherRecommendation(weather);
  const mood = weatherMood(weather);

  return (
    <LinearGradient colors={SKY_GRADIENT} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.flex}>
          <View style={styles.tempRow}>
            <Text variant="displayLarge" color="strong" style={styles.temp}>{weather.temperature}°</Text>
            <Emoji size={34}>{weather.emoji}</Emoji>
          </View>
          <Text variant="title" color="body">{weather.label}</Text>
        </View>
        <View style={styles.stats}>
          <Badge label={mood} tone="sage" dot />
          <Text variant="bodySmall" color="muted" style={styles.statLine}>H {weather.high}°  ·  L {weather.low}°</Text>
          <Text variant="bodySmall" color="muted">💧 {weather.precipitationProbability}% rain</Text>
        </View>
      </View>

      <View style={styles.tipRow}>
        <Emoji size={18}>{tip.emoji}</Emoji>
        <Text variant="bodySmall" color="strong" style={styles.flex}>{tip.text}</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  card: {
    borderRadius: radii.xl,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border.soft,
  },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', columnGap: spacing.md },
  tempRow: { flexDirection: 'row', alignItems: 'center', columnGap: 10 },
  temp: { letterSpacing: -1 },
  stats: { alignItems: 'flex-end', rowGap: 4 },
  statLine: { marginTop: 2 },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginTop: spacing.base,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.06)',
  },
  minRow: { flexDirection: 'row', alignItems: 'center', columnGap: 10 },
  permTitle: { marginTop: spacing.sm },
  permMsg: { marginTop: 4 },
  permActions: { flexDirection: 'row', alignItems: 'center', columnGap: spacing.sm, marginTop: spacing.base },
});

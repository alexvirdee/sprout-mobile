/**
 * WeatherWateringCard — compact, watering-focused weather guidance. Reuses the
 * weather feature's location + forecast. Weather *enhances* watering (a tip);
 * it never blocks it. Handles loading / denied / unavailable gracefully.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight, MapPin } from 'lucide-react-native';

import { Card, Emoji, Skeleton, Text } from '@components/index';
import { colors, palette, radii } from '@theme/index';
import { CurrentWeather } from '@features/weather/types/weather.types';
import { LocationStatus } from '@features/weather/hooks/useDeviceLocation';
import { wateringRecommendation } from '../utils/wateringRecommendations';

export interface WeatherWateringCardProps {
  status: LocationStatus;
  weather?: CurrentWeather;
  isLoading: boolean;
  isError: boolean;
  onEnable: () => void;
}

export function WeatherWateringCard({ status, weather, isLoading, isError, onEnable }: WeatherWateringCardProps) {
  if (status === 'loading' || (status === 'granted' && isLoading && !weather)) {
    return <Skeleton height={92} radius={radii.lg} />;
  }

  if (status === 'denied') {
    return (
      <Pressable onPress={onEnable} accessibilityRole="button">
        <Card padding="sm" radius="lg">
          <View style={styles.minRow}>
            <MapPin size={18} color={palette.green[700]} />
            <Text variant="label" tint={palette.green[700]} style={styles.flex}>
              Enable weather for smarter watering tips
            </Text>
            <ChevronRight size={18} color={colors.text.subtle} />
          </View>
        </Card>
      </Pressable>
    );
  }

  // Granted-but-broken, unavailable, or no coords: still offer a soil-check tip.
  if (status === 'unavailable' || isError || !weather) {
    const tip = wateringRecommendation(null);
    return (
      <Card padding="sm" radius="lg">
        <View style={styles.tipRow}>
          <Emoji size={18}>{tip.emoji}</Emoji>
          <Text variant="bodySmall" color="body" style={styles.flex}>
            {tip.text}
          </Text>
        </View>
      </Card>
    );
  }

  const tip = wateringRecommendation(weather);

  return (
    <Card padding="md" radius="lg">
      <View style={styles.top}>
        <Emoji size={26}>{weather.emoji}</Emoji>
        <View style={styles.flex}>
          <Text variant="title" color="strong">
            {weather.temperature}° · {weather.label}
          </Text>
          <Text variant="caption" color="muted">
            💧 {weather.precipitationProbability}% rain · H {weather.high}°
          </Text>
        </View>
      </View>
      <View style={styles.tipRow}>
        <Emoji size={18}>{tip.emoji}</Emoji>
        <Text variant="bodySmall" color="body" style={styles.flex}>
          {tip.text}
        </Text>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  minRow: { flexDirection: 'row', alignItems: 'center', columnGap: 10 },
  top: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
  },
});

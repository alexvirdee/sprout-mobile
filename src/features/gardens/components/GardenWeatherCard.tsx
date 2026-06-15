/**
 * GardenWeatherCard — current conditions for a garden's saved coordinates
 * (set via the location autocomplete). Reuses the weather feature's Open-Meteo
 * hook. Renders nothing if the forecast can't be loaded.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, Emoji, Skeleton, Text } from '@components/index';
import { radii } from '@theme/index';
import { useCurrentWeather } from '@features/weather/hooks/useCurrentWeather';

export interface GardenWeatherCardProps {
  latitude: number;
  longitude: number;
}

export function GardenWeatherCard({ latitude, longitude }: GardenWeatherCardProps) {
  const { data: weather, isLoading, isError } = useCurrentWeather({ latitude, longitude });

  if (isLoading) return <Skeleton height={76} radius={radii.lg} />;
  if (isError || !weather) return null;

  return (
    <Card padding="md" radius="lg" elevation="sm">
      <View style={styles.row}>
        <Emoji size={30}>{weather.emoji}</Emoji>
        <View style={styles.flex}>
          <Text variant="title" color="strong">
            {weather.temperature}° · {weather.label}
          </Text>
          <Text variant="caption" color="muted">
            H {weather.high}° · L {weather.low}° · 💧 {weather.precipitationProbability}% rain
          </Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 14 },
  flex: { flex: 1 },
});

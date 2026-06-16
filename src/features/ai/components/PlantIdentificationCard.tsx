/**
 * PlantIdentificationCard — the hero of the result screen: the photo, an honest
 * "Sprout thinks this might be…" headline, scientific name, and a confidence pill.
 */

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { Card, Text } from '@components/index';
import { spacing } from '@theme/index';
import { PlantIdentification } from '../types/ai.types';
import { confidenceLevel, identificationHeadline } from '../utils/confidence';
import { ConfidenceBadge } from './ConfidenceBadge';

export interface PlantIdentificationCardProps {
  result: PlantIdentification;
  imageUri: string;
}

export function PlantIdentificationCard({ result, imageUri }: PlantIdentificationCardProps) {
  const level = confidenceLevel(result.confidence);

  return (
    <Card padding="none" radius="xl" elevation="sm" style={styles.card}>
      <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      <View style={styles.body}>
        <Text variant="eyebrow" color="muted">
          Sprout thinks this might be
        </Text>
        <Text variant="h1" color="strong" style={styles.headline}>
          {identificationHeadline(result.commonName, level, result.isPlant)}
        </Text>
        {result.scientificName ? (
          <Text variant="bodySmall" color="muted" style={styles.sci}>
            {result.scientificName}
          </Text>
        ) : null}
        <View style={styles.badge}>
          <ConfidenceBadge confidence={result.confidence} />
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { overflow: 'hidden' },
  image: { width: '100%', height: 200 },
  body: { padding: spacing.lg, rowGap: 4 },
  headline: { marginTop: 2 },
  sci: { fontStyle: 'italic' },
  badge: { marginTop: spacing.sm, flexDirection: 'row' },
});

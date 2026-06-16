/**
 * PlantScanLoading — a calm, friendly loading state shown while the AI looks at
 * the photo. Rotates through gentle copy so the wait feels alive.
 */

import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';

import { Emoji, Text } from '@components/index';
import { palette, spacing } from '@theme/index';

const MESSAGES = [
  'Looking closely at your plant…',
  'Consulting Sprout’s plant knowledge…',
  'Matching leaves, shapes, and colors…',
  'Almost there…',
];

export function PlantScanLoading() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.wrap}>
      <Emoji size={48}>🌿</Emoji>
      <ActivityIndicator color={palette.green[500]} style={styles.spinner} />
      <Text variant="title" color="strong" align="center">
        {MESSAGES[index]}
      </Text>
      <Text variant="bodySmall" color="muted" align="center" style={styles.sub}>
        This usually takes a few seconds.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: 'center', paddingVertical: spacing['3xl'], rowGap: spacing.sm },
  spinner: { marginVertical: spacing.sm },
  sub: { marginTop: 2 },
});

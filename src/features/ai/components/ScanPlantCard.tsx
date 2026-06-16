/**
 * ScanPlantCard — the Home entry point for AI plant scanning. A premium, tappable
 * card with a camera affordance.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, ChevronRight, Sparkles } from 'lucide-react-native';

import { Card, Text } from '@components/index';
import { colors, palette, radii } from '@theme/index';

export interface ScanPlantCardProps {
  onPress: () => void;
}

export function ScanPlantCard({ onPress }: ScanPlantCardProps) {
  return (
    <Card onPress={onPress} padding="md" radius="xl" elevation="sm">
      <View style={styles.row}>
        <LinearGradient
          colors={[palette.green[400], palette.green[600]]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.disc}
        >
          <Camera size={24} color="#fff" />
        </LinearGradient>
        <View style={styles.text}>
          <View style={styles.titleRow}>
            <Text variant="h3" color="strong">
              Scan a plant
            </Text>
            <Sparkles size={15} color={palette.gold[500]} />
          </View>
          <Text variant="bodySmall" color="muted">
            Take a photo and Sprout will help identify it.
          </Text>
        </View>
        <ChevronRight size={20} color={colors.text.subtle} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 14 },
  disc: { width: 52, height: 52, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  text: { flex: 1, rowGap: 3 },
  titleRow: { flexDirection: 'row', alignItems: 'center', columnGap: 6 },
});

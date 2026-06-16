/**
 * AIPlantDisclaimer — a calm reminder that AI identification isn't perfect.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Info } from 'lucide-react-native';

import { Text } from '@components/index';
import { colors } from '@theme/index';

export interface AIPlantDisclaimerProps {
  text: string;
}

export function AIPlantDisclaimer({ text }: AIPlantDisclaimerProps) {
  return (
    <View style={styles.row}>
      <Info size={14} color={colors.text.subtle} />
      <Text variant="caption" color="subtle" style={styles.flex}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', columnGap: 8 },
  flex: { flex: 1 },
});

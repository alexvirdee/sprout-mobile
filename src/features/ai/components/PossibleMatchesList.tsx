/**
 * PossibleMatchesList — the AI's other candidates. Tapping one makes it the
 * chosen plant (updates the editable name + scientific name on the result
 * screen). Hidden when there's only a single match.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Check } from 'lucide-react-native';

import { Card, Text } from '@components/index';
import { colors, palette } from '@theme/index';
import { PlantMatch } from '../types/ai.types';
import { confidencePercent } from '../utils/confidence';

export interface PossibleMatchesListProps {
  matches: PlantMatch[];
  selectedName: string;
  onSelect: (match: PlantMatch) => void;
}

export function PossibleMatchesList({ matches, selectedName, onSelect }: PossibleMatchesListProps) {
  if (matches.length <= 1) return null;

  return (
    <Card padding="none" radius="lg" elevation="sm">
      {matches.map((m, i) => {
        const active = m.commonName === selectedName;
        return (
          <Pressable
            key={`${m.commonName}-${i}`}
            accessibilityRole="radio"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(m)}
            style={[styles.row, i > 0 && styles.border]}
          >
            <View style={styles.flex}>
              <Text variant="title" color="strong">
                {m.commonName}
              </Text>
              {m.scientificName ? (
                <Text variant="caption" color="muted">
                  {m.scientificName}
                </Text>
              ) : null}
            </View>
            <Text variant="caption" color="subtle">
              {confidencePercent(m.confidence)}%
            </Text>
            <View style={[styles.radio, active && styles.radioActive]}>
              {active ? <Check size={13} color="#fff" strokeWidth={3} /> : null}
            </View>
          </Pressable>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12, paddingHorizontal: 16, paddingVertical: 14 },
  border: { borderTopWidth: 1, borderTopColor: colors.border.soft },
  flex: { flex: 1, rowGap: 2 },
  radio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border.default,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: { borderColor: palette.green[500], backgroundColor: palette.green[500] },
});

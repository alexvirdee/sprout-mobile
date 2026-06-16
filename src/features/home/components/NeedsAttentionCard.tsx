/**
 * NeedsAttentionCard — gardens/plants that could use care. Tapping a row opens
 * the garden. When nothing needs attention, shows a rewarding positive state.
 * Headerless — CollapsibleSection provides the section title on Home.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { ChevronRight } from 'lucide-react-native';

import { Badge, Card, Emoji, Text } from '@components/index';
import { colors, radii } from '@theme/index';
import { AttentionItem } from '../utils/homeRecommendations';

export interface NeedsAttentionCardProps {
  items: AttentionItem[];
  onPress: (gardenId: string) => void;
}

export function NeedsAttentionCard({ items, onPress }: NeedsAttentionCardProps) {
  if (items.length === 0) {
    return (
      <Card padding="md" radius="lg" elevation="sm">
        <View style={styles.healthy}>
          <Emoji size={30}>🌱</Emoji>
          <Text variant="title" color="strong" align="center" style={styles.healthyTitle}>
            Everything is looking healthy
          </Text>
          <Text variant="bodySmall" color="muted" align="center">
            Your gardens are well cared for. Lovely work.
          </Text>
        </View>
      </Card>
    );
  }

  return (
    <Card padding="none" radius="lg" elevation="sm">
      {items.map((item, i) => (
        <React.Fragment key={item.id}>
          {i > 0 ? <View style={styles.divider} /> : null}
          <Pressable
            accessibilityRole="button"
            onPress={() => onPress(item.gardenId)}
            style={({ pressed }) => (pressed ? styles.pressed : undefined)}
          >
            <View style={styles.row}>
              <View style={styles.chip}>
                <Emoji size={16}>{item.emoji}</Emoji>
              </View>
              <View style={styles.text}>
                <Text variant="title" color="strong" numberOfLines={1}>
                  {item.title}
                </Text>
                <Text variant="caption" color="muted">
                  {item.detail}
                </Text>
              </View>
              <Badge label={item.kind === 'garden' ? 'Garden' : 'Plant'} tone={item.tone} />
              <ChevronRight size={18} color={colors.text.subtle} />
            </View>
          </Pressable>
        </React.Fragment>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  healthy: { alignItems: 'center', rowGap: 4, paddingVertical: 6 },
  healthyTitle: { marginTop: 4 },
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12, padding: 14 },
  divider: { height: 1, backgroundColor: colors.border.soft, marginLeft: 56 },
  pressed: { backgroundColor: colors.surface.sunken },
  chip: {
    width: 34,
    height: 34,
    borderRadius: radii.md,
    backgroundColor: colors.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: { flex: 1, rowGap: 2 },
});

/**
 * RecentActivityCard — a lightweight feed of recent meaningful actions. Tap a
 * row to open the related garden/plant; a just-logged watering shows "Undo".
 * Headerless — CollapsibleSection provides the title on Home.
 */

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Card, Emoji, Text } from '@components/index';
import { colors, palette, radii } from '@theme/index';
import { relativeTime } from '@utils/format';
import { ActivityItem } from '../utils/homeActivity';

export interface RecentActivityCardProps {
  items: ActivityItem[];
  onOpen: (item: ActivityItem) => void;
  onUndo: (wateringId: string) => void;
}

export function RecentActivityCard({ items, onOpen, onUndo }: RecentActivityCardProps) {
  return (
    <Card padding="none" radius="lg" elevation="sm">
      {items.length === 0 ? (
        <View style={styles.empty}>
          <Emoji size={26}>🌿</Emoji>
          <Text variant="bodySmall" color="muted" align="center" style={styles.emptyText}>
            Your activity will appear here as you water, plant, and grow.
          </Text>
        </View>
      ) : (
        items.map((item, i) => (
          <View key={item.id}>
            {i > 0 ? <View style={styles.divider} /> : null}
            <Pressable
              accessibilityRole="button"
              onPress={() => onOpen(item)}
              style={({ pressed }) => (pressed ? styles.pressed : undefined)}
            >
              <View style={styles.row}>
                <View style={styles.chip}>
                  <Emoji size={15}>{item.emoji}</Emoji>
                </View>
                <Text variant="body" color="body" style={styles.flex} numberOfLines={1}>
                  {item.text}
                </Text>
                {item.undoable && item.wateringId ? (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityLabel="Undo watering"
                    onPress={() => onUndo(item.wateringId as string)}
                    hitSlop={8}
                    style={styles.undo}
                  >
                    <Text variant="label" tint={palette.green[700]}>
                      Undo
                    </Text>
                  </Pressable>
                ) : (
                  <Text variant="caption" color="subtle">
                    {relativeTime(item.at)}
                  </Text>
                )}
              </View>
            </Pressable>
          </View>
        ))
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  empty: { alignItems: 'center', rowGap: 8, paddingVertical: 20, paddingHorizontal: 16 },
  emptyText: { maxWidth: 260 },
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12, paddingHorizontal: 14, paddingVertical: 12 },
  divider: { height: 1, backgroundColor: colors.border.soft, marginLeft: 52 },
  pressed: { backgroundColor: colors.surface.sunken },
  flex: { flex: 1 },
  chip: {
    width: 30,
    height: 30,
    borderRadius: radii.sm,
    backgroundColor: palette.green[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  undo: { paddingHorizontal: 10, paddingVertical: 4, backgroundColor: palette.green[50], borderRadius: radii.pill },
});

/**
 * GardenCard — a premium, tappable summary of one garden. A gradient accent disc
 * (by garden type), the name + type badge, location, plant count + size, a
 * health badge, and a "last updated" line.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight, Leaf, MapPin, Ruler } from 'lucide-react-native';

import { Badge, BadgeTone, Card, Emoji, Text } from '@components/index';
import { colors, palette, radii } from '@theme/index';
import { relativeDay } from '@utils/format';
import { ACCENT_COLORS, Garden, GardenAccent, gardenTypeMeta, sizeSummary } from '../types/garden.types';

const ACCENT_BADGE: Record<GardenAccent, BadgeTone> = {
  green: 'green',
  sage: 'sage',
  gold: 'gold',
  terra: 'terra',
  info: 'neutral',
  neutral: 'neutral',
};

export interface GardenCardProps {
  garden: Garden;
  onPress: () => void;
}

function GardenCardBase({ garden, onPress }: GardenCardProps) {
  const meta = gardenTypeMeta(garden.type);
  const accent = ACCENT_COLORS[meta.accent];

  return (
    <Card
      onPress={onPress}
      padding="md"
      radius="lg"
      elevation="sm"
      accessibilityLabel={`${garden.name}, ${meta.label}, ${garden.plantCount} plants`}
    >
      <View style={styles.top}>
        <LinearGradient colors={accent.grad} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.disc}>
          <Emoji size={26}>{meta.emoji}</Emoji>
        </LinearGradient>
        <View style={styles.titleCol}>
          <Text variant="h3" color="strong" numberOfLines={1}>
            {garden.name}
          </Text>
          <View style={styles.badgeRow}>
            <Badge label={meta.label} tone={ACCENT_BADGE[meta.accent]} />
          </View>
        </View>
        <ChevronRight size={20} color={colors.text.subtle} />
      </View>

      <View style={styles.locRow}>
        <MapPin size={14} color={colors.text.muted} />
        <Text variant="bodySmall" color="muted" numberOfLines={1} style={styles.flex}>
          {garden.locationLabel || 'No location set'}
        </Text>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.meta}>
          <Leaf size={14} color={palette.green[600]} />
          <Text variant="caption" color="muted">{garden.plantCount} plants</Text>
        </View>
        <View style={styles.meta}>
          <Ruler size={14} color={palette.sageScale[600]} />
          <Text variant="caption" color="muted" numberOfLines={1}>{sizeSummary(garden)}</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <Badge label={garden.healthStatus} tone="sage" dot />
        <Text variant="caption" color="subtle">Updated {relativeDay(garden.updatedAt)}</Text>
      </View>
    </Card>
  );
}

// List item — memoized so the gardens FlatList doesn't re-render every card.
export const GardenCard = React.memo(GardenCardBase);

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  disc: { width: 52, height: 52, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' },
  titleCol: { flex: 1, rowGap: 5 },
  badgeRow: { flexDirection: 'row' },
  flex: { flex: 1 },
  locRow: { flexDirection: 'row', alignItems: 'center', columnGap: 6, marginTop: 14 },
  metaRow: { flexDirection: 'row', alignItems: 'center', columnGap: 16, marginTop: 8 },
  meta: { flexDirection: 'row', alignItems: 'center', columnGap: 5, flexShrink: 1 },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
  },
});

/**
 * JournalEntryCard — one moment in the timeline: a harvest, note, or milestone.
 * Shows the type, a gentle relative date, an optional harvest quantity + rating,
 * the note, and an optional photo. Long-press surfaces actions (e.g. delete).
 */

import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Star } from 'lucide-react-native';

import { Badge, Card, Emoji, Text } from '@components/index';
import { colors, palette, radii, spacing } from '@theme/index';
import { JournalEntry } from '../types/journal.types';
import { entryTypeMeta, formatHarvest, formatOccurredAt } from '../utils/journalLabels';

export interface JournalEntryCardProps {
  entry: JournalEntry;
  onPress?: () => void;
  onLongPress?: () => void;
}

function Stars({ rating }: { rating: number }) {
  return (
    <View style={styles.stars} accessibilityLabel={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={13}
          color={palette.gold[500]}
          fill={i <= rating ? palette.gold[500] : 'transparent'}
        />
      ))}
    </View>
  );
}

function JournalEntryCardBase({ entry, onPress, onLongPress }: JournalEntryCardProps) {
  const meta = entryTypeMeta(entry.type);
  const harvest = formatHarvest(entry.quantity, entry.unit);
  const title = entry.title?.trim() || (entry.type === 'harvest' && harvest ? `Harvested ${harvest}` : meta.label);
  const a11y = `${meta.label}${title ? `, ${title}` : ''}, ${formatOccurredAt(entry.occurredAt)}`;

  return (
    <Card padding="sm" radius="lg">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={a11y}
        accessibilityHint={onLongPress ? 'Long press for options' : undefined}
        onPress={onPress}
        onLongPress={onLongPress}
        style={styles.press}
      >
        <View style={styles.row}>
          <View style={styles.chip}>
            <Emoji size={20}>{meta.emoji}</Emoji>
          </View>
          <View style={styles.head}>
            <Text variant="title" color="strong" numberOfLines={1}>
              {title}
            </Text>
            <Text variant="caption" color="muted">
              {formatOccurredAt(entry.occurredAt)}
            </Text>
          </View>
          {entry.type === 'harvest' && harvest ? <Badge label={harvest} tone="gold" /> : null}
        </View>

        {entry.rating ? <Stars rating={entry.rating} /> : null}

        {entry.note ? (
          <Text variant="body" color="body" style={styles.note} numberOfLines={4}>
            {entry.note}
          </Text>
        ) : null}

        {entry.photoUrl ? (
          <Image source={{ uri: entry.photoUrl }} style={styles.photo} resizeMode="cover" accessibilityIgnoresInvertColors />
        ) : null}
      </Pressable>
    </Card>
  );
}

// Timeline rows are static once rendered — memoize to keep long lists smooth.
export const JournalEntryCard = React.memo(JournalEntryCardBase);

const styles = StyleSheet.create({
  press: { rowGap: spacing.sm },
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  chip: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: colors.surface.sunken,
    alignItems: 'center',
    justifyContent: 'center',
  },
  head: { flex: 1, rowGap: 2 },
  stars: { flexDirection: 'row', columnGap: 2 },
  note: {},
  photo: { width: '100%', height: 180, borderRadius: radii.md, backgroundColor: colors.surface.sunken },
});

/**
 * CareReminderSetupScreen — the optional "Set up care reminders?" step shown
 * after adding a plant (or from a plant with no reminders yet). Suggestions are
 * pre-selected; the user toggles, then enables or skips. Never forced.
 *
 * Suggestions start from Sprout's deterministic rules. The user can optionally
 * "Tailor with AI" to fine-tune timing for their variety + season — but the
 * rules are always the trustworthy fallback (if AI is unavailable we quietly
 * keep the standard guidance and say so).
 */

import React, { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, RotateCcw, Sparkles } from 'lucide-react-native';

import { Badge, Button, IconButton, Skeleton, Text } from '@components/index';
import { colors, gutter, palette, radii, spacing } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { useAiCareSuggestions, useCareSuggestions } from '../hooks/useCareSuggestions';
import { useEnableCareSuggestions } from '../hooks/useCareTaskActions';
import { CareReminderSetupList } from '../components';
import { CareSuggestion, EnableCareInput } from '../types/care.types';

export function CareReminderSetupScreen({ navigation, route }: GardensStackScreenProps<'CareReminderSetup'>) {
  const { plantId, gardenId } = route.params;
  const insets = useSafeAreaInsets();
  const { data: rulesSuggestions = [], isLoading } = useCareSuggestions(plantId);
  const enable = useEnableCareSuggestions(plantId);
  const ai = useAiCareSuggestions(plantId);

  const [selected, setSelected] = useState<string[] | null>(null);
  // When the user tailors with AI, the refined list replaces the rules list.
  const [aiSuggestions, setAiSuggestions] = useState<CareSuggestion[] | null>(null);
  const [aiTailored, setAiTailored] = useState(false);
  const [aiNote, setAiNote] = useState<string | null>(null);

  const suggestions = aiSuggestions ?? rulesSuggestions;
  const selectedKeys = selected ?? suggestions.map((s) => s.key);

  const toggle = (key: string) => {
    const base = selected ?? suggestions.map((s) => s.key);
    setSelected(base.includes(key) ? base.filter((k) => k !== key) : [...base, key]);
  };

  const onTailor = () => {
    setAiNote(null);
    ai.mutate(undefined, {
      onSuccess: (res) => {
        setAiSuggestions(res.suggestions);
        if (res.aiUsed) {
          setAiTailored(true);
        } else {
          // AI unavailable — the server returned the rules untouched.
          setAiTailored(false);
          setAiNote('AI tailoring isn’t available right now — showing Sprout’s standard guidance.');
        }
      },
      onError: () => setAiNote('Couldn’t tailor just now — showing standard guidance.'),
    });
  };

  const revertToStandard = () => {
    setAiSuggestions(null);
    setAiTailored(false);
    setAiNote(null);
  };

  const goToGarden = () => navigation.navigate('GardenDetail', { id: gardenId });
  const onEnable = () => {
    if (selectedKeys.length === 0) {
      goToGarden();
      return;
    }
    // AI-tailored suggestions can't be re-derived server-side, so send the full
    // bodies; rules suggestions are sent by key (the server rebuilds them).
    const input: EnableCareInput = aiTailored
      ? { suggestions: suggestions.filter((s) => selectedKeys.includes(s.key)), source: 'ai' }
      : { keys: selectedKeys };
    enable.mutate(input, {
      onSuccess: () => navigation.navigate('GardenDetail', { id: gardenId, flash: 'Care reminders set 🌱' }),
    });
  };

  const showTailor = !isLoading && suggestions.length > 0;

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.text.body} />
        </IconButton>
        <Text variant="h2" color="strong">
          Care reminders
        </Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: 120 }]}
      >
        <View style={styles.head}>
          <Text variant="display" color="strong">
            Set up care reminders?
          </Text>
          <Text variant="bodyLarge" color="muted" style={styles.sub}>
            Set it once and Sprout will remind you. These are gentle suggestions — your garden knows best.
          </Text>
        </View>

        {showTailor ? (
          aiTailored ? (
            <View style={styles.tailoredRow}>
              <Badge label="✨ AI-tailored" tone="green" />
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Revert to standard suggestions"
                onPress={revertToStandard}
                hitSlop={8}
                style={styles.revert}
              >
                <RotateCcw size={14} color={colors.text.muted} />
                <Text variant="caption" color="muted">
                  Revert to standard
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Tailor these reminders to your plant with AI"
              accessibilityState={{ busy: ai.isPending }}
              onPress={onTailor}
              disabled={ai.isPending}
              style={styles.tailorCard}
            >
              <View style={styles.tailorChip}>
                {ai.isPending ? (
                  <ActivityIndicator size="small" color={palette.green[700]} />
                ) : (
                  <Sparkles size={20} color={palette.green[700]} />
                )}
              </View>
              <View style={styles.tailorText}>
                <Text variant="title" color="strong">
                  {ai.isPending ? 'Tailoring…' : 'Tailor to your plant'}
                </Text>
                <Text variant="caption" color="muted">
                  Fine-tune timing for your variety &amp; season with AI
                </Text>
              </View>
            </Pressable>
          )
        ) : null}

        {aiNote ? (
          <Text variant="caption" color="muted" style={styles.note}>
            {aiNote}
          </Text>
        ) : null}

        {isLoading ? (
          <View style={styles.list}>
            <Skeleton height={64} radius={radii.lg} />
            <Skeleton height={64} radius={radii.lg} />
            <Skeleton height={64} radius={radii.lg} />
          </View>
        ) : suggestions.length === 0 ? (
          <Text variant="body" color="muted">
            No suggestions for this plant yet — you can add reminders manually anytime.
          </Text>
        ) : (
          <CareReminderSetupList suggestions={suggestions} selectedKeys={selectedKeys} onToggle={toggle} />
        )}

        {aiTailored ? (
          <Text variant="caption" color="muted" style={styles.disclaimer}>
            AI-tailored from Sprout’s guidance for your plant. Always use your own judgment — your garden knows best.
          </Text>
        ) : null}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: insets.bottom + 12 }]}>
        <Button
          label={selectedKeys.length > 0 ? `Enable ${selectedKeys.length} reminder${selectedKeys.length === 1 ? '' : 's'}` : 'Enable reminders'}
          fullWidth
          loading={enable.isPending}
          disabled={isLoading}
          onPress={onEnable}
        />
        <Button label="Skip for now" variant="ghost" fullWidth onPress={goToGarden} style={styles.skip} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface.page },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    paddingHorizontal: gutter,
    paddingBottom: spacing.base,
  },
  spacer: { width: 42 },
  body: { paddingHorizontal: gutter, paddingTop: spacing.sm },
  head: { marginBottom: spacing.lg, rowGap: 6 },
  sub: {},
  tailorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 12,
    padding: 12,
    marginBottom: spacing.base,
    borderRadius: radii.lg,
    borderWidth: 1.5,
    borderColor: palette.green[200],
    backgroundColor: palette.green[50],
  },
  tailorChip: {
    width: 40,
    height: 40,
    borderRadius: radii.md,
    backgroundColor: palette.green[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  tailorText: { flex: 1, rowGap: 2 },
  tailoredRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.base,
  },
  revert: { flexDirection: 'row', alignItems: 'center', columnGap: 4 },
  note: { marginBottom: spacing.base },
  list: { rowGap: 10 },
  disclaimer: { marginTop: spacing.base },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.surface.card,
  },
  skip: { marginTop: 4 },
});

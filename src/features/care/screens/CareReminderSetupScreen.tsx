/**
 * CareReminderSetupScreen — the optional "Set up care reminders?" step shown
 * after adding a plant (or from a plant with no reminders yet). Suggestions are
 * pre-selected; the user toggles, then enables or skips. Never forced.
 */

import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft } from 'lucide-react-native';

import { Button, IconButton, Skeleton, Text } from '@components/index';
import { colors, gutter, palette, radii, spacing } from '@theme/index';
import { GardensStackScreenProps } from '@app-types/navigation';
import { useCareSuggestions } from '../hooks/useCareSuggestions';
import { useEnableCareSuggestions } from '../hooks/useCareTaskActions';
import { CareReminderSetupList } from '../components';

export function CareReminderSetupScreen({ navigation, route }: GardensStackScreenProps<'CareReminderSetup'>) {
  const { plantId, gardenId } = route.params;
  const insets = useSafeAreaInsets();
  const { data: suggestions = [], isLoading } = useCareSuggestions(plantId);
  const enable = useEnableCareSuggestions(plantId);
  const [selected, setSelected] = useState<string[] | null>(null);

  const selectedKeys = selected ?? suggestions.map((s) => s.key);
  const toggle = (key: string) => {
    const base = selected ?? suggestions.map((s) => s.key);
    setSelected(base.includes(key) ? base.filter((k) => k !== key) : [...base, key]);
  };

  const goToGarden = () => navigation.navigate('GardenDetail', { id: gardenId });
  const onEnable = () => {
    if (selectedKeys.length === 0) {
      goToGarden();
      return;
    }
    enable.mutate(selectedKeys, {
      onSuccess: () => navigation.navigate('GardenDetail', { id: gardenId, flash: 'Care reminders set 🌱' }),
    });
  };

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
  list: { rowGap: 10 },
  footer: {
    paddingHorizontal: gutter,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border.soft,
    backgroundColor: colors.surface.card,
  },
  skip: { marginTop: 4 },
});

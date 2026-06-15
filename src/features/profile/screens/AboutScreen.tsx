/**
 * AboutScreen — a polished "about Sprout": brand mark, version, mission, and
 * (placeholder) links to website, support, privacy, and terms.
 */

import React from 'react';
import { Linking, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, FileText, Globe, LifeBuoy, Shield } from 'lucide-react-native';

import { Card, Emoji, IconButton, SectionHeader, Text } from '@components/index';
import { colors, gradients, gutter, palette, radii, shadows, spacing } from '@theme/index';
import { ProfileStackScreenProps } from '@app-types/navigation';
import { SettingDivider, SettingRow } from '../components';
import { APP_VERSION, MISSION, SPROUT_LINKS } from '../constants';

export function AboutScreen({ navigation }: ProfileStackScreenProps<'About'>) {
  const insets = useSafeAreaInsets();
  const open = (url: string) => void Linking.openURL(url);

  return (
    <View style={styles.root}>
      <StatusBar style="dark" />
      <View style={[styles.topBar, { paddingTop: insets.top + 8 }]}>
        <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()}>
          <ArrowLeft size={22} color={colors.text.body} />
        </IconButton>
        <Text variant="h2" color="strong">
          About
        </Text>
        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingBottom: insets.bottom + 40 }]}
      >
        <View style={styles.brand}>
          <LinearGradient
            colors={gradients.meadow.colors}
            start={gradients.meadow.start}
            end={gradients.meadow.end}
            style={[styles.mark, shadows.sm]}
          >
            <Emoji size={40}>🌱</Emoji>
          </LinearGradient>
          <Text variant="display" color="strong" style={styles.name}>
            Sprout
          </Text>
          <Text variant="bodySmall" color="muted">
            Version {APP_VERSION}
          </Text>
        </View>

        <Card padding="md" radius="lg" elevation="sm">
          <Text variant="eyebrow" tint={palette.green[700]}>
            Our mission
          </Text>
          <Text variant="bodyLarge" color="body" style={styles.mission}>
            {MISSION}
          </Text>
        </Card>

        <View>
          <SectionHeader title="Learn more" />
          <Card padding="none" radius="lg" elevation="sm">
            <SettingRow icon={<Globe size={18} color={palette.green[700]} />} label="Website" onPress={() => open(SPROUT_LINKS.website)} />
            <SettingDivider />
            <SettingRow icon={<LifeBuoy size={18} color={palette.sageScale[700]} />} label="Support" onPress={() => open(SPROUT_LINKS.support)} />
            <SettingDivider />
            <SettingRow icon={<Shield size={18} color={palette.green[700]} />} label="Privacy policy" onPress={() => open(SPROUT_LINKS.privacy)} />
            <SettingDivider />
            <SettingRow icon={<FileText size={18} color={colors.text.muted} />} label="Terms of service" onPress={() => open(SPROUT_LINKS.terms)} />
          </Card>
        </View>

        <Text variant="caption" color="subtle" align="center" style={styles.footer}>
          Made with 💚 for gardeners everywhere
        </Text>
      </ScrollView>
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
  body: { paddingHorizontal: gutter, paddingTop: spacing.sm, rowGap: spacing.lg },
  brand: { alignItems: 'center', paddingVertical: spacing.lg, rowGap: 6 },
  mark: {
    width: 88,
    height: 88,
    borderRadius: radii.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  name: {},
  mission: { marginTop: 8 },
  footer: { marginTop: spacing.sm },
});

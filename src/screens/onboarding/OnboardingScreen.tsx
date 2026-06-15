/**
 * OnboardingScreen — three calm, paged slides that explain plant tracking,
 * garden planning, and reminders + harvest tracking. Finishing marks the user
 * as onboarded (RootNavigator then routes to Auth).
 */

import React, { useRef, useState } from 'react';
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';

import { Button, Text } from '@components/index';
import { colors, gradients, palette, radii, spacing } from '@theme/index';
import { useOnboardingStore } from '@store/onboardingStore';
import { GradientName } from '@theme/index';

interface Slide {
  emoji: string;
  eyebrow: string;
  title: string;
  body: string;
  gradient: GradientName;
}

const SLIDES: Slide[] = [
  {
    emoji: '🌱',
    eyebrow: 'Track',
    title: 'Every leaf, logged.',
    body: 'Keep a calm, quiet record of everything growing — stages, photos, and notes for each plant in your garden.',
    gradient: 'meadow',
  },
  {
    emoji: '🗺️',
    eyebrow: 'Plan',
    title: 'Plan your season.',
    body: 'Lay out beds, sketch what goes where, and follow a gentle timeline of when to sow, transplant, and harvest.',
    gradient: 'dawn',
  },
  {
    emoji: '💧',
    eyebrow: 'Tend',
    title: "We'll remind you.",
    body: 'Get warm, well-timed nudges to water and feed — then celebrate every harvest as it comes in.',
    gradient: 'sun',
  },
];

export function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const complete = useOnboardingStore((s) => s.complete);
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);

  const isLast = index === SLIDES.length - 1;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  const onNext = () => {
    if (isLast) {
      void complete();
    } else {
      scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.skipRow}>
        <Pressable onPress={() => void complete()} hitSlop={10}>
          <Text variant="label" color="muted">
            Skip
          </Text>
        </Pressable>
      </View>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        scrollEventThrottle={16}
      >
        {SLIDES.map((slide) => (
          <View key={slide.title} style={[styles.slide, { width }]}>
            <LinearGradient
              colors={gradients[slide.gradient].colors}
              start={gradients[slide.gradient].start}
              end={gradients[slide.gradient].end}
              style={styles.disc}
            >
              <Text style={styles.emoji}>{slide.emoji}</Text>
            </LinearGradient>
            <Text variant="eyebrow" tint={palette.green[700]} style={styles.eyebrow}>
              {slide.eyebrow}
            </Text>
            <Text variant="display" color="strong" align="center">
              {slide.title}
            </Text>
            <Text variant="bodyLarge" color="muted" align="center" style={styles.body}>
              {slide.body}
            </Text>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => (
            <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
          ))}
        </View>
        <Button label={isLast ? 'Start your garden' : 'Next'} size="lg" fullWidth onPress={onNext} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.surface.page },
  skipRow: { alignItems: 'flex-end', paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  slide: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  disc: {
    width: 200,
    height: 200,
    borderTopLeftRadius: 120,
    borderTopRightRadius: 90,
    borderBottomLeftRadius: 96,
    borderBottomRightRadius: 130,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing['2xl'],
  },
  emoji: { fontSize: 92 },
  eyebrow: { marginBottom: spacing.sm },
  body: { marginTop: spacing.md, maxWidth: 320 },
  footer: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg, rowGap: spacing.lg },
  dots: { flexDirection: 'row', justifyContent: 'center', columnGap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: palette.neutral[300] },
  dotActive: { width: 22, backgroundColor: palette.green[500], borderRadius: radii.pill },
});

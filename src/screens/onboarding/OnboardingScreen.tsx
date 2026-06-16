/**
 * OnboardingScreen — three calm, paged slides that explain plant tracking,
 * garden planning, and reminders + harvest tracking, followed by a gentle
 * permission-priming step (notifications + location). Finishing marks the user
 * as onboarded (RootNavigator then routes to Auth).
 *
 * Priming is opt-in and never blocks: the OS prompt only appears if the user
 * taps a card, and "Enter Sprout" always proceeds. Permissions are device-level
 * (this runs before sign-in), so asking here is fine; the guided first garden
 * lives in the post-sign-in empty states.
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
import * as Location from 'expo-location';
import { Bell, Check, MapPin } from 'lucide-react-native';

import { Button, Card, Emoji, Text } from '@components/index';
import { colors, gradients, palette, radii, spacing } from '@theme/index';
import { useOnboardingStore } from '@store/onboardingStore';
import { requestNotificationPermission } from '@services/notifications';
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

type Phase = 'slides' | 'permissions';
type PermState = 'idle' | 'granted' | 'denied';

export function OnboardingScreen() {
  const { width } = useWindowDimensions();
  const complete = useOnboardingStore((s) => s.complete);
  const scrollRef = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('slides');

  const [notif, setNotif] = useState<PermState>('idle');
  const [loc, setLoc] = useState<PermState>('idle');
  const [busy, setBusy] = useState<null | 'notif' | 'loc'>(null);

  const isLast = index === SLIDES.length - 1;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const next = Math.round(e.nativeEvent.contentOffset.x / width);
    if (next !== index) setIndex(next);
  };

  const onNext = () => {
    if (isLast) {
      setPhase('permissions');
    } else {
      scrollRef.current?.scrollTo({ x: width * (index + 1), animated: true });
    }
  };

  const askNotif = async () => {
    setBusy('notif');
    try {
      setNotif((await requestNotificationPermission()) ? 'granted' : 'denied');
    } catch {
      setNotif('denied');
    } finally {
      setBusy(null);
    }
  };

  const askLoc = async () => {
    setBusy('loc');
    try {
      const res = await Location.requestForegroundPermissionsAsync();
      setLoc(res.granted ? 'granted' : 'denied');
    } catch {
      setLoc('denied');
    } finally {
      setBusy(null);
    }
  };

  if (phase === 'permissions') {
    return (
      <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
        <ScrollView contentContainerStyle={styles.permsBody} showsVerticalScrollIndicator={false}>
          <Text variant="eyebrow" tint={palette.green[700]} style={styles.eyebrow}>
            Almost there
          </Text>
          <Text variant="display" color="strong">
            Two quick things
          </Text>
          <Text variant="bodyLarge" color="muted" style={styles.permsSub}>
            Both are optional and you can change them anytime in Settings.
          </Text>

          <View style={styles.primeList}>
            <PrimingCard
              icon={<Bell size={22} color={palette.green[700]} />}
              title="Gentle care reminders"
              body="Water, prune, and harvest nudges at just the right time — never spammy."
              ctaLabel="Turn on reminders"
              status={notif}
              busy={busy === 'notif'}
              onAsk={askNotif}
            />
            <PrimingCard
              icon={<MapPin size={22} color={palette.green[700]} />}
              title="Local weather for your garden"
              body="See conditions and frost warnings for where you actually grow."
              ctaLabel="Enable location"
              status={loc}
              busy={busy === 'loc'}
              onAsk={askLoc}
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button label="Enter Sprout 🌱" size="lg" fullWidth onPress={() => void complete()} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <View style={styles.skipRow}>
        <Pressable accessibilityRole="button" accessibilityLabel="Skip onboarding" onPress={() => void complete()} hitSlop={10}>
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
        <Button label={isLast ? 'Continue' : 'Next'} size="lg" fullWidth onPress={onNext} />
      </View>
    </SafeAreaView>
  );
}

function PrimingCard({
  icon,
  title,
  body,
  ctaLabel,
  status,
  busy,
  onAsk,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  ctaLabel: string;
  status: PermState;
  busy: boolean;
  onAsk: () => void;
}) {
  return (
    <Card padding="md" radius="lg">
      <View style={styles.primeRow}>
        <View style={styles.primeIcon}>{icon}</View>
        <View style={styles.flex}>
          <Text variant="title" color="strong">
            {title}
          </Text>
          <Text variant="caption" color="muted">
            {body}
          </Text>
        </View>
      </View>
      {status === 'granted' ? (
        <View style={styles.granted}>
          <Check size={16} color={palette.green[600]} />
          <Text variant="bodySmall" tint={palette.green[700]}>
            You&apos;re all set
          </Text>
        </View>
      ) : (
        <>
          <Button label={ctaLabel} variant="secondary" loading={busy} onPress={onAsk} style={styles.primeCta} />
          {status === 'denied' ? (
            <Text variant="caption" color="muted" style={styles.deniedNote}>
              No worries — you can turn this on later in Settings.
            </Text>
          ) : null}
        </>
      )}
    </Card>
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

  // Permission priming
  permsBody: { paddingHorizontal: spacing.lg, paddingTop: spacing['2xl'], paddingBottom: spacing.xl },
  permsSub: { marginTop: spacing.sm, maxWidth: 340 },
  primeList: { marginTop: spacing.xl, rowGap: spacing.base },
  primeRow: { flexDirection: 'row', alignItems: 'center', columnGap: 12 },
  primeIcon: {
    width: 44,
    height: 44,
    borderRadius: radii.md,
    backgroundColor: palette.green[50],
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex: { flex: 1 },
  primeCta: { marginTop: spacing.base, alignSelf: 'flex-start' },
  granted: { flexDirection: 'row', alignItems: 'center', columnGap: 6, marginTop: spacing.base },
  deniedNote: { marginTop: spacing.sm },
});

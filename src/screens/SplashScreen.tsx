/**
 * SplashScreen — the branded welcome moment shown while the session restores.
 * Leaf gradient, the reversed sprout mark, wordmark, and the brand line.
 */

import React, { useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, StyleSheet, View } from 'react-native';

import { GradientBackground } from '@components/index';
import { LogoMark, Text } from '@components/index';
import { palette, spacing } from '@theme/index';

export function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const rise = useRef(new Animated.Value(12)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(rise, { toValue: 0, duration: 600, useNativeDriver: true }),
    ]).start();
  }, [fade, rise]);

  return (
    <GradientBackground gradient="leaf">
      <View style={styles.center}>
        <Animated.View style={[styles.content, { opacity: fade, transform: [{ translateY: rise }] }]}>
          <View style={styles.markWell}>
            <LogoMark size={72} variant="cream" />
          </View>
          <Text variant="displayLarge" tint={palette.warmCream} style={styles.wordmark}>
            Sprout
          </Text>
          <Text variant="bodyLarge" tint="rgba(255,255,255,0.9)" align="center" style={styles.tagline}>
            Watching your garden thrive.
          </Text>
        </Animated.View>
      </View>
      <View style={styles.loader}>
        <ActivityIndicator color="rgba(255,255,255,0.85)" />
      </View>
    </GradientBackground>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: spacing.xl },
  content: { alignItems: 'center' },
  markWell: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  wordmark: { letterSpacing: -1 },
  tagline: { marginTop: spacing.sm },
  loader: { position: 'absolute', bottom: 64, left: 0, right: 0, alignItems: 'center' },
});

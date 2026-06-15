/**
 * ProgressRing — circular progress for growth %, watering level, season
 * progress. Animates the arc on mount. Built on react-native-svg.
 */

import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { palette, colors } from '@theme/index';
import { Text } from './Text';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

type Tone = 'green' | 'gold' | 'terra' | 'sage' | 'info';

const TONES: Record<Tone, string> = {
  green: palette.green[500],
  gold: palette.gold[400],
  terra: palette.terra[400],
  sage: palette.sageScale[500],
  info: colors.status.info,
};

export interface ProgressRingProps {
  value?: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: Tone;
  label?: string;
  sublabel?: string;
}

export function ProgressRing({
  value = 0,
  max = 100,
  size = 96,
  thickness = 9,
  tone = 'green',
  label,
  sublabel,
}: ProgressRingProps) {
  const pct = Math.max(0, Math.min(1, value / max));
  const r = (size - thickness) / 2;
  const circumference = 2 * Math.PI * r;
  const stroke = TONES[tone];

  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: pct,
      duration: 900,
      useNativeDriver: false,
    }).start();
  }, [pct, anim]);

  const strokeDashoffset = anim.interpolate({
    inputRange: [0, 1],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={palette.neutral[150]}
          strokeWidth={thickness}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={stroke}
          strokeWidth={thickness}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          // rotate so the arc starts at 12 o'clock
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Svg>
      <View style={styles.center}>
        {label != null ? (
          <Text variant="h2" color="strong" style={{ fontSize: size * 0.24, lineHeight: size * 0.26 }}>
            {label}
          </Text>
        ) : null}
        {sublabel ? (
          <Text variant="caption" color="muted" style={{ fontSize: size * 0.12 }}>
            {sublabel}
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

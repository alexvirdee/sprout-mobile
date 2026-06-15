/**
 * Logo — the Sprout two-leaf mark, ported from the brand SVG (assets/logo-mark).
 * `variant="cream"` is the reversed mark for green/dark grounds. Pass
 * `withWordmark` to render the mark beside the "Sprout" wordmark.
 */

import React from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

import { palette } from '@theme/index';
import { Text } from '../ui/Text';

export interface LogoProps {
  size?: number;
  variant?: 'default' | 'cream';
  withWordmark?: boolean;
}

const LEAF = 'M32 40 C24.5 36 21 27.5 32 19 C43 27.5 39.5 36 32 40 Z';

export function LogoMark({ size = 64, variant = 'default' }: LogoProps) {
  const cream = variant === 'cream';
  const stem = cream ? palette.warmCream : palette.green[600];
  const leftLeaf = cream ? palette.warmCream : palette.green[500];
  const rightLeaf = cream ? palette.warmCream : palette.sage;

  return (
    <Svg width={size} height={size} viewBox="0 0 64 64">
      <Path
        d="M32 58 C32 47 32 42 32 36"
        stroke={stem}
        strokeWidth={5}
        strokeLinecap="round"
        fill="none"
      />
      <G rotation={-40} origin="32, 40">
        <Path d={LEAF} fill={leftLeaf} />
      </G>
      <G rotation={40} origin="32, 40">
        <Path d={LEAF} fill={rightLeaf} opacity={cream ? 0.82 : 1} />
      </G>
    </Svg>
  );
}

export function Logo({ size = 40, variant = 'default', withWordmark = false }: LogoProps) {
  if (!withWordmark) {
    return <LogoMark size={size} variant={variant} />;
  }
  return (
    <View style={styles.row}>
      <LogoMark size={size} variant={variant} />
      <Text
        variant="h1"
        tint={variant === 'cream' ? palette.warmCream : palette.neutral[800]}
        style={[styles.wordmark, { fontSize: size * 0.62 }]}
      >
        Sprout
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', columnGap: 8 },
  wordmark: { letterSpacing: -0.5 },
});

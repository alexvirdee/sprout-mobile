/**
 * Avatar — user image with initials fallback (and a friendly sprout glyph if
 * there is no name). `ring` adds the brand focus halo used on the dashboard.
 */

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';

import { colors, palette } from '@theme/index';
import { Text } from './Text';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZES: Record<Size, number> = { xs: 28, sm: 36, md: 46, lg: 60, xl: 80 };

export interface AvatarProps {
  source?: string;
  name?: string;
  size?: Size;
  ring?: boolean;
}

function initialsFor(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export function Avatar({ source, name = '', size = 'md', ring = false }: AvatarProps) {
  const d = SIZES[size];
  const initials = initialsFor(name);

  return (
    <View
      style={[
        styles.base,
        {
          width: d,
          height: d,
          borderRadius: d / 2,
        },
        ring && {
          borderWidth: 3,
          borderColor: palette.green[300],
        },
      ]}
    >
      {source ? (
        <Image source={{ uri: source }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <Text variant="title" tint={palette.sageScale[900]} style={{ fontSize: d * 0.38 }}>
          {initials || '🌱'}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: palette.sageScale[200],
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});

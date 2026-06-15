/**
 * Card — the foundational soft surface. White, hairline border, warm shadow,
 * large rounded corners. Pass `onPress` to make it an interactive tile (adds a
 * gentle press scale).
 */

import React from 'react';
import { Pressable, View, ViewProps, ViewStyle } from 'react-native';

import { colors, radii, shadows } from '@theme/index';

type Elevation = 'none' | 'sm' | 'md' | 'lg';
type Padding = 'none' | 'sm' | 'md' | 'lg';
type Radius = 'md' | 'lg' | 'xl' | '2xl';

export interface CardProps extends ViewProps {
  children: React.ReactNode;
  elevation?: Elevation;
  padding?: Padding;
  radius?: Radius;
  onPress?: () => void;
  style?: ViewStyle;
}

const PADDING: Record<Padding, number> = { none: 0, sm: 16, md: 24, lg: 32 };
const RADIUS: Record<Radius, number> = { md: radii.md, lg: radii.lg, xl: radii.xl, '2xl': radii['2xl'] };

export function Card({
  children,
  elevation = 'sm',
  padding = 'md',
  radius = 'lg',
  onPress,
  style,
  ...rest
}: CardProps) {
  const base: ViewStyle = {
    backgroundColor: colors.surface.card,
    borderWidth: 1,
    borderColor: colors.border.soft,
    borderRadius: RADIUS[radius],
    padding: PADDING[padding],
    ...shadows[elevation],
  };

  if (onPress) {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={onPress}
        style={({ pressed }): ViewStyle => ({
          ...base,
          ...(pressed ? shadows.md : {}),
          transform: [{ scale: pressed ? 0.985 : 1 }],
          ...style,
        })}
        {...rest}
      >
        {children}
      </Pressable>
    );
  }

  return (
    <View style={[base, style]} {...rest}>
      {children}
    </View>
  );
}

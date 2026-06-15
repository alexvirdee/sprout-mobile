/**
 * IconButton — circular icon-only button. Variants: soft · ghost · solid · outline.
 * Always pass `accessibilityLabel` so the control is screen-reader friendly.
 */

import React from 'react';
import { Pressable, PressableProps, ViewStyle } from 'react-native';

import { colors, palette, radii } from '@theme/index';

type Variant = 'soft' | 'ghost' | 'solid' | 'outline';
type Size = 'sm' | 'md' | 'lg';

export interface IconButtonProps extends Omit<PressableProps, 'style'> {
  children: React.ReactNode;
  accessibilityLabel: string;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  style?: ViewStyle;
}

const SIZES: Record<Size, number> = { sm: 34, md: 42, lg: 50 };

const VARIANTS: Record<Variant, { bg: string; pressedBg: string; border?: string }> = {
  soft: { bg: colors.surface.brandSoft, pressedBg: palette.green[100] },
  ghost: { bg: 'transparent', pressedBg: colors.surface.muted },
  solid: { bg: colors.action.primary, pressedBg: colors.action.primaryHover },
  outline: { bg: colors.surface.card, pressedBg: colors.surface.muted, border: colors.border.default },
};

export function IconButton({
  children,
  accessibilityLabel,
  variant = 'soft',
  size = 'md',
  disabled = false,
  style,
  ...rest
}: IconButtonProps) {
  const d = SIZES[size];
  const v = VARIANTS[variant];

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      accessibilityState={{ disabled }}
      disabled={disabled}
      style={({ pressed }): ViewStyle => ({
        width: d,
        height: d,
        borderRadius: radii.pill,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: pressed && !disabled ? v.pressedBg : v.bg,
        borderWidth: v.border ? 1.5 : 0,
        borderColor: v.border ?? 'transparent',
        opacity: disabled ? 0.5 : 1,
        transform: [{ scale: pressed && !disabled ? 0.94 : 1 }],
        ...style,
      })}
      {...rest}
    >
      {children}
    </Pressable>
  );
}

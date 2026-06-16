/**
 * Button — Sprout's primary action. Pill-shaped, soft brand shadow, gentle
 * press scale. Variants: primary · secondary · ghost · gold · soft.
 *
 * CTAs are invitations in Sprout's voice: "Start your garden", "Log a harvest".
 */

import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  PressableProps,
  StyleSheet,
  View,
  ViewStyle,
} from 'react-native';

import { colors, palette, radii, shadows } from '@theme/index';
import { Text } from './Text';

type Variant = 'primary' | 'secondary' | 'ghost' | 'gold' | 'soft';
type Size = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  loading?: boolean;
  disabled?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  style?: ViewStyle;
}

const SIZES: Record<Size, { height: number; paddingHorizontal: number; fontSize: number; gap: number }> = {
  sm: { height: 36, paddingHorizontal: 14, fontSize: 14, gap: 7 },
  md: { height: 44, paddingHorizontal: 20, fontSize: 15, gap: 8 },
  lg: { height: 54, paddingHorizontal: 28, fontSize: 17, gap: 10 },
};

const VARIANT_BG: Record<Variant, string> = {
  primary: colors.action.primary,
  secondary: colors.surface.card,
  ghost: 'transparent',
  gold: colors.action.accent,
  soft: colors.surface.brandSoft,
};

const VARIANT_PRESSED_BG: Record<Variant, string> = {
  primary: colors.action.primaryHover,
  secondary: colors.surface.brandSoft,
  ghost: colors.surface.brandSoft,
  gold: colors.action.accentHover,
  soft: palette.green[100],
};

const VARIANT_FG: Record<Variant, ButtonTextColor> = {
  primary: 'onBrand',
  secondary: 'link',
  ghost: 'link',
  gold: 'onGold',
  soft: 'link',
};

type ButtonTextColor = 'onBrand' | 'onGold' | 'link';

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled = false,
  iconLeft,
  iconRight,
  style,
  ...rest
}: ButtonProps) {
  const s = SIZES[size];
  const isDisabled = disabled || loading;

  const containerStyle = ({ pressed }: { pressed: boolean }): ViewStyle => ({
    height: s.height,
    paddingHorizontal: s.paddingHorizontal,
    borderRadius: radii.pill,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: s.gap,
    alignSelf: fullWidth ? 'stretch' : 'flex-start',
    width: fullWidth ? '100%' : undefined,
    backgroundColor: pressed && !isDisabled ? VARIANT_PRESSED_BG[variant] : VARIANT_BG[variant],
    borderWidth: variant === 'secondary' ? 1.5 : 1,
    borderColor: variant === 'secondary' ? colors.border.brand : 'transparent',
    opacity: isDisabled ? 0.5 : 1,
    transform: [{ scale: pressed && !isDisabled ? 0.97 : 1 }],
    ...(variant === 'primary' ? shadows.brand : {}),
    ...(variant === 'gold' ? shadows.gold : {}),
    ...(variant === 'secondary' ? shadows.xs : {}),
    // Honor a caller-supplied style (margins, alignSelf, etc.) — applied last so
    // it can override the computed defaults.
    ...style,
  });

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={containerStyle}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.text.onBrand : colors.action.primary}
        />
      ) : (
        <>
          {iconLeft ? <View style={styles.icon}>{iconLeft}</View> : null}
          <Text
            variant="label"
            color={VARIANT_FG[variant]}
            style={{ fontSize: s.fontSize, letterSpacing: -0.1 }}
          >
            {label}
          </Text>
          {iconRight ? <View style={styles.icon}>{iconRight}</View> : null}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  icon: { alignItems: 'center', justifyContent: 'center' },
});

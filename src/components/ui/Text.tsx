/**
 * Text — the typography primitive. Wraps RN <Text> with brand type variants
 * and semantic colors so screens never hand-roll font sizes or families.
 *
 * <Text variant="h1">Your garden</Text>
 * <Text variant="body" color="muted">Best before the heat of the day</Text>
 */

import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';

import { colors, typography, TypographyVariant } from '@theme/index';

type ColorToken =
  | 'strong'
  | 'body'
  | 'muted'
  | 'subtle'
  | 'onBrand'
  | 'onGold'
  | 'inverse'
  | 'link'
  | 'success'
  | 'warning'
  | 'danger';

const COLOR_MAP: Record<ColorToken, string> = {
  strong: colors.text.strong,
  body: colors.text.body,
  muted: colors.text.muted,
  subtle: colors.text.subtle,
  onBrand: colors.text.onBrand,
  onGold: colors.text.onGold,
  inverse: colors.text.inverse,
  link: colors.text.link,
  success: colors.status.success,
  warning: colors.action.accentHover,
  danger: colors.status.danger,
};

export interface TextProps extends RNTextProps {
  variant?: TypographyVariant;
  color?: ColorToken;
  align?: 'auto' | 'left' | 'right' | 'center' | 'justify';
  /** Convenience override for one-off colors not in the token set. */
  tint?: string;
}

export function Text({
  variant = 'body',
  color = 'body',
  align,
  tint,
  style,
  children,
  ...rest
}: TextProps) {
  const variantStyle = typography[variant] ?? typography.body;
  return (
    <RNText
      style={[
        variantStyle,
        { color: tint ?? COLOR_MAP[color] },
        align ? { textAlign: align } : null,
        style,
      ]}
      {...rest}
    >
      {children}
    </RNText>
  );
}

export const textStyles = StyleSheet.create({});

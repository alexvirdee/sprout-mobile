/**
 * Input — labelled text field with optional leading icon, hint, error, and a
 * password visibility toggle. Designed to drop into react-hook-form via a
 * Controller (pass value / onChangeText / onBlur).
 */

import React, { forwardRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { colors, palette, radii } from '@theme/index';
import { Text } from './Text';

type Size = 'sm' | 'md' | 'lg';
const HEIGHTS: Record<Size, number> = { sm: 40, md: 48, lg: 56 };

export interface InputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  size?: Size;
  /** Show an eye toggle (only meaningful with secureTextEntry). */
  passwordToggle?: boolean;
  containerStyle?: ViewStyle;
}

export const Input = forwardRef<TextInput, InputProps>(function Input(
  {
    label,
    hint,
    error,
    iconLeft,
    size = 'md',
    passwordToggle = false,
    secureTextEntry,
    containerStyle,
    onFocus,
    onBlur,
    ...rest
  },
  ref
) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);
  const h = HEIGHTS[size];

  const borderColor = error
    ? colors.status.danger
    : focused
    ? palette.green[400]
    : colors.border.default;

  return (
    <View style={[styles.wrap, containerStyle]}>
      {label ? (
        <Text variant="label" color="strong">
          {label}
        </Text>
      ) : null}

      <View
        style={[
          styles.field,
          { height: h, borderColor },
          focused && styles.fieldFocused,
        ]}
      >
        {iconLeft ? <View style={styles.icon}>{iconLeft}</View> : null}
        <TextInput
          ref={ref}
          style={styles.input}
          placeholderTextColor={colors.text.subtle}
          secureTextEntry={passwordToggle ? hidden : secureTextEntry}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          {...rest}
        />
        {passwordToggle ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Show password' : 'Hide password'}
            onPress={() => setHidden((v) => !v)}
            hitSlop={8}
          >
            {hidden ? (
              <EyeOff size={20} color={colors.text.subtle} />
            ) : (
              <Eye size={20} color={colors.text.subtle} />
            )}
          </Pressable>
        ) : null}
      </View>

      {error || hint ? (
        <Text variant="caption" color={error ? 'danger' : 'muted'}>
          {error ?? hint}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  wrap: { rowGap: 7, width: '100%' },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 10,
    paddingHorizontal: 16,
    backgroundColor: colors.surface.card,
    borderWidth: 1.5,
    borderRadius: radii.md,
  },
  fieldFocused: {
    // soft green focus ring approximation
    shadowColor: palette.green[400],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { alignItems: 'center', justifyContent: 'center' },
  input: {
    flex: 1,
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 15,
    color: colors.text.strong,
    paddingVertical: 0,
  },
});

/**
 * AppTextInput — the one text field primitive for the whole app.
 *
 * Reliability features (the reasons inputs used to flake on iOS / Expo Go):
 *  - The ENTIRE field (label-row padding + leading icon + text) is a focus
 *    target: a Pressable focuses the inner TextInput, so a tap anywhere lands.
 *    The TextInput still receives direct taps, and the password toggle keeps its
 *    own; nothing is intercepted.
 *  - Stable identity (top-level component, controlled value) → never remounts,
 *    so focus is never dropped by a parent re-render.
 *  - First-class `multiline` support (notes), top-aligned and growing.
 *  - `forwardRef` to the TextInput so screens can chain focus (returnKeyType).
 */

import React, { forwardRef, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';
import { Eye, EyeOff } from 'lucide-react-native';

import { colors, palette, radii } from '@theme/index';
import { mergeRefs } from '@utils/mergeRefs';
import { Text } from './Text';

type Size = 'sm' | 'md' | 'lg';
const HEIGHTS: Record<Size, number> = { sm: 40, md: 48, lg: 56 };

export interface AppTextInputProps extends Omit<TextInputProps, 'style'> {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  size?: Size;
  /** Show an eye toggle (only meaningful with secureTextEntry). */
  passwordToggle?: boolean;
  containerStyle?: ViewStyle;
}

export const AppTextInput = forwardRef<TextInput, AppTextInputProps>(function AppTextInput(
  {
    label,
    hint,
    error,
    iconLeft,
    size = 'md',
    passwordToggle = false,
    secureTextEntry,
    multiline,
    containerStyle,
    onFocus,
    onBlur,
    ...rest
  },
  ref
) {
  const innerRef = useRef<TextInput | null>(null);
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  // Expose the TextInput to parents (focus chaining) while keeping an internal
  // ref for tap-to-focus. Memoized so the ref callback identity is stable across
  // re-renders (no detach/reattach churn).
  const setRefs = useMemo(() => mergeRefs<TextInput>(ref, innerRef), [ref]);

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

      <Pressable
        // Tap anywhere in the field → focus the input. The TextInput and the
        // password toggle still handle their own taps; this only catches the
        // padding / icon "dead zones" that used to require a precise tap.
        onPress={() => innerRef.current?.focus()}
        style={[
          styles.field,
          multiline ? styles.fieldMultiline : null,
          { minHeight: multiline ? 96 : HEIGHTS[size], borderColor },
          focused && styles.fieldFocused,
        ]}
      >
        {iconLeft ? <View style={[styles.icon, multiline && styles.iconTop]}>{iconLeft}</View> : null}
        <TextInput
          ref={setRefs}
          style={[styles.input, multiline && styles.inputMultiline]}
          placeholderTextColor={colors.text.subtle}
          selectionColor={palette.green[500]}
          multiline={multiline}
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
            hitSlop={10}
          >
            {hidden ? (
              <EyeOff size={20} color={colors.text.subtle} />
            ) : (
              <Eye size={20} color={colors.text.subtle} />
            )}
          </Pressable>
        ) : null}
      </Pressable>

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
  fieldMultiline: { alignItems: 'flex-start', paddingVertical: 12 },
  fieldFocused: {
    // soft green focus ring approximation
    shadowColor: palette.green[400],
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 2,
  },
  icon: { alignItems: 'center', justifyContent: 'center' },
  iconTop: { paddingTop: 2 },
  input: {
    flex: 1,
    fontFamily: 'HankenGrotesk_400Regular',
    fontSize: 15,
    color: colors.text.strong,
    paddingVertical: 0,
  },
  inputMultiline: { paddingTop: 1, textAlignVertical: 'top' },
});

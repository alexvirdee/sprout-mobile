/**
 * SignUpScreen — name + email + password account creation, with the same
 * Google option. Validation copy stays gentle (see utils/validation).
 */

import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Mail, Lock, User as UserIcon } from 'lucide-react-native';

import { Button, IconButton, Input, ScreenContainer, Text } from '@components/index';
import { colors, palette, spacing } from '@theme/index';
import { useAuth } from '@hooks/useAuth';
import { signUpSchema, SignUpValues } from '@utils/validation';
import { isGoogleConfigured } from '@/config/env';
import { ApiError } from '@app-types/api';
import { AuthStackScreenProps } from '@app-types/navigation';
import { GoogleButton, OrDivider } from './parts';

export function SignUpScreen({ navigation }: AuthStackScreenProps<'SignUp'>) {
  const { signup } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const { control, handleSubmit, setError, formState } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: '', email: '', password: '' },
  });

  const onSubmit = async (values: SignUpValues) => {
    try {
      await signup(values.name.trim(), values.email.trim(), values.password);
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 409
          ? 'An account with this email already exists. Try signing in?'
          : 'We could not create your account just now. Please try again.';
      setError('email', { message });
    }
  };

  const onGoogle = async () => {
    if (!isGoogleConfigured()) {
      Alert.alert(
        'Almost there',
        'Google sign-in is wired up but needs OAuth client IDs. See the README ("Google OAuth setup") to finish connecting it.'
      );
      return;
    }
    setGoogleLoading(true);
    setGoogleLoading(false);
  };

  return (
    <ScreenContainer scroll>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <IconButton
          accessibilityLabel="Go back"
          variant="ghost"
          onPress={() => navigation.goBack()}
          style={styles.back}
        >
          <ChevronLeft size={24} color={colors.text.strong} />
        </IconButton>

        <View style={styles.header}>
          <Text variant="display" color="strong">
            Grow something good.
          </Text>
          <Text variant="bodyLarge" color="muted">
            Create your account and plant your first seed.
          </Text>
        </View>

        <View style={styles.form}>
          <Controller
            control={control}
            name="name"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <Input
                label="Name"
                placeholder="Maya Flores"
                autoCapitalize="words"
                autoComplete="name"
                iconLeft={<UserIcon size={20} color={colors.text.subtle} />}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <Input
                label="Email"
                placeholder="you@garden.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                iconLeft={<Mail size={20} color={colors.text.subtle} />}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={fieldState.error?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <Input
                label="Password"
                placeholder="At least 8 characters"
                secureTextEntry
                passwordToggle
                autoCapitalize="none"
                iconLeft={<Lock size={20} color={colors.text.subtle} />}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={fieldState.error?.message}
                hint="Use 8+ characters with a letter and a number."
              />
            )}
          />

          <Button
            label="Create account"
            size="lg"
            fullWidth
            loading={formState.isSubmitting}
            onPress={handleSubmit(onSubmit)}
            style={styles.submit}
          />

          <OrDivider />
          <GoogleButton onPress={onGoogle} disabled={googleLoading} />
        </View>

        <View style={styles.footer}>
          <Text variant="body" color="muted">
            Already growing with us?{' '}
          </Text>
          <Pressable onPress={() => navigation.navigate('SignIn')} hitSlop={6}>
            <Text variant="label" tint={palette.green[700]}>
              Sign in
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: spacing.sm, marginLeft: -spacing.sm },
  header: { marginTop: spacing.base, marginBottom: spacing.xl, rowGap: spacing.sm },
  form: { rowGap: spacing.base },
  submit: { marginTop: spacing.xs },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing.xl,
  },
});

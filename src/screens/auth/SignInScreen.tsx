/**
 * SignInScreen — email + password sign in, Continue with Google, and a quiet
 * "Explore the demo" path so the app is usable before the backend is running.
 */

import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react-native';

import { Button, Input, LogoMark, ScreenContainer, Text } from '@components/index';
import { colors, palette, spacing } from '@theme/index';
import { useAuth } from '@hooks/useAuth';
import { signInSchema, SignInValues } from '@utils/validation';
import { isGoogleConfigured } from '@/config/env';
import { ApiError } from '@app-types/api';
import { AuthStackScreenProps } from '@app-types/navigation';
import { GoogleButton, OrDivider } from './parts';

export function SignInScreen({ navigation }: AuthStackScreenProps<'SignIn'>) {
  const { login, demoSignIn } = useAuth();
  const [googleLoading, setGoogleLoading] = useState(false);

  const { control, handleSubmit, setError, formState } = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (values: SignInValues) => {
    try {
      await login(values.email.trim(), values.password);
    } catch (err) {
      const message =
        err instanceof ApiError && err.status === 401
          ? "That email and password don't match. Want to try again?"
          : 'We could not sign you in just now. Check your connection and try again.';
      setError('password', { message });
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
    // With client IDs set, complete the expo-auth-session flow here to obtain an
    // ID token, then call: await googleSignIn(idToken).
    setGoogleLoading(false);
  };

  return (
    <ScreenContainer scroll>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <LogoMark size={48} />
          <Text variant="display" color="strong" style={styles.title}>
            Welcome back
          </Text>
          <Text variant="bodyLarge" color="muted">
            Your garden has been waiting for you.
          </Text>
        </View>

        <View style={styles.form}>
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
                placeholder="••••••••"
                secureTextEntry
                passwordToggle
                autoCapitalize="none"
                iconLeft={<Lock size={20} color={colors.text.subtle} />}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={fieldState.error?.message}
              />
            )}
          />

          <Pressable
            onPress={() => navigation.navigate('ForgotPassword')}
            hitSlop={8}
            style={styles.forgot}
          >
            <Text variant="label" tint={palette.green[700]}>
              Forgot password?
            </Text>
          </Pressable>

          <Button
            label="Sign in"
            size="lg"
            fullWidth
            loading={formState.isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />

          <OrDivider />
          <GoogleButton onPress={onGoogle} disabled={googleLoading} />

          <Button label="Explore the demo" variant="ghost" fullWidth onPress={demoSignIn} />
        </View>

        <View style={styles.footer}>
          <Text variant="body" color="muted">
            New to Sprout?{' '}
          </Text>
          <Pressable onPress={() => navigation.navigate('SignUp')} hitSlop={6}>
            <Text variant="label" tint={palette.green[700]}>
              Create an account
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: spacing.xl, marginBottom: spacing.xl, rowGap: spacing.sm },
  title: { marginTop: spacing.base },
  form: { rowGap: spacing.base },
  forgot: { alignSelf: 'flex-end', marginTop: -spacing.xs, marginBottom: spacing.xs },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing['2xl'],
    marginBottom: spacing.xl,
  },
});

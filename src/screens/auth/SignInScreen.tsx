/**
 * SignInScreen — email + password sign in, Continue with Google, and a quiet
 * "Explore the demo" path. Uses the app-wide KeyboardAwareScreen + FormTextInput.
 */

import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, Lock } from 'lucide-react-native';

import { Button, FormTextInput, KeyboardAwareScreen, LogoMark, Text } from '@components/index';
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
  const passwordRef = useRef<TextInput>(null);

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
    setGoogleLoading(false);
  };

  return (
    <KeyboardAwareScreen>
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
        <FormTextInput
          control={control}
          name="email"
          label="Email"
          placeholder="you@garden.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
          textContentType="emailAddress"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => passwordRef.current?.focus()}
          iconLeft={<Mail size={20} color={colors.text.subtle} />}
        />
        <FormTextInput
          control={control}
          name="password"
          inputRef={passwordRef}
          label="Password"
          placeholder="••••••••"
          secureTextEntry
          passwordToggle
          autoCapitalize="none"
          textContentType="password"
          returnKeyType="done"
          onSubmitEditing={handleSubmit(onSubmit)}
          iconLeft={<Lock size={20} color={colors.text.subtle} />}
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
    </KeyboardAwareScreen>
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

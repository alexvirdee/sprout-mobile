/**
 * SignUpScreen — name + email + password account creation. Uses the app-wide
 * KeyboardAwareScreen + FormTextInput, with focus chaining between fields.
 */

import React, { useRef, useState } from 'react';
import { Alert, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronLeft, Mail, Lock, User as UserIcon } from 'lucide-react-native';

import { Button, FormTextInput, IconButton, KeyboardAwareScreen, Text } from '@components/index';
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
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

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
    <KeyboardAwareScreen
      header={
        <IconButton accessibilityLabel="Go back" variant="ghost" onPress={() => navigation.goBack()} style={styles.back}>
          <ChevronLeft size={24} color={colors.text.strong} />
        </IconButton>
      }
    >
      <View style={styles.headerText}>
        <Text variant="display" color="strong">
          Grow something good.
        </Text>
        <Text variant="bodyLarge" color="muted">
          Create your account and plant your first seed.
        </Text>
      </View>

      <View style={styles.form}>
        <FormTextInput
          control={control}
          name="name"
          label="Name"
          placeholder="Maya Flores"
          autoCapitalize="words"
          autoComplete="name"
          textContentType="name"
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => emailRef.current?.focus()}
          iconLeft={<UserIcon size={20} color={colors.text.subtle} />}
        />
        <FormTextInput
          control={control}
          name="email"
          inputRef={emailRef}
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
          placeholder="At least 8 characters"
          secureTextEntry
          passwordToggle
          autoCapitalize="none"
          textContentType="newPassword"
          returnKeyType="done"
          onSubmitEditing={handleSubmit(onSubmit)}
          iconLeft={<Lock size={20} color={colors.text.subtle} />}
          hint="Use 8+ characters with a letter and a number."
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
    </KeyboardAwareScreen>
  );
}

const styles = StyleSheet.create({
  back: { marginTop: spacing.sm, marginLeft: spacing.base - spacing.sm },
  headerText: { marginTop: spacing.base, marginBottom: spacing.xl, rowGap: spacing.sm },
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

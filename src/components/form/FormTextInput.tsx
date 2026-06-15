/**
 * FormTextInput — AppTextInput wired to react-hook-form. The single way forms
 * declare a field, so the Controller wiring (controlled value, onBlur, error) is
 * identical everywhere and can't be hand-rolled inconsistently.
 *
 *   <FormTextInput control={control} name="email" label="Email" ... />
 */

import React from 'react';
import { TextInput } from 'react-native';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';

import { AppTextInput, AppTextInputProps } from '../ui/AppTextInput';

export interface FormTextInputProps<T extends FieldValues>
  extends Omit<AppTextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'error'> {
  control: Control<T>;
  name: FieldPath<T>;
  /** Ref to the underlying TextInput, for chaining focus between fields. */
  inputRef?: React.Ref<TextInput>;
}

export function FormTextInput<T extends FieldValues>({
  control,
  name,
  inputRef,
  ...inputProps
}: FormTextInputProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState }) => (
        <AppTextInput
          {...inputProps}
          ref={inputRef}
          value={(value as string) ?? ''}
          onChangeText={onChange}
          onBlur={onBlur}
          error={fieldState.error?.message}
        />
      )}
    />
  );
}

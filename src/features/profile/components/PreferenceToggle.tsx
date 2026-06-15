/**
 * PreferenceToggle — a settings row with a Switch. Thin wrapper over SettingRow
 * so notification/theme toggles stay visually consistent with navigational rows.
 */

import React from 'react';

import { Switch } from '@components/index';
import { SettingRow } from './SettingRow';

export interface PreferenceToggleProps {
  icon: React.ReactNode;
  label: string;
  hint?: string;
  value: boolean;
  onValueChange: (next: boolean) => void;
  disabled?: boolean;
}

export function PreferenceToggle({ icon, label, hint, value, onValueChange, disabled }: PreferenceToggleProps) {
  return (
    <SettingRow
      icon={icon}
      label={label}
      hint={hint}
      control={<Switch value={value} onValueChange={onValueChange} disabled={disabled} />}
    />
  );
}

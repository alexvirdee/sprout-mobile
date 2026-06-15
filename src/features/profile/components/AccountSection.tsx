/**
 * AccountSection — the "Account" card: change password, legal links, about,
 * app version, sign out, and a (Phase-2) delete-account placeholder.
 */

import React from 'react';
import { View } from 'react-native';
import { FileText, Info, KeyRound, LogOut, Shield, Trash2 } from 'lucide-react-native';

import { Card, SectionHeader } from '@components/index';
import { colors, palette } from '@theme/index';
import { SettingRow, SettingDivider } from './SettingRow';

export interface AccountSectionProps {
  version: string;
  onChangePassword: () => void;
  onAbout: () => void;
  onPrivacy: () => void;
  onTerms: () => void;
  onSignOut: () => void;
  onDeleteAccount: () => void;
}

export function AccountSection({
  version,
  onChangePassword,
  onAbout,
  onPrivacy,
  onTerms,
  onSignOut,
  onDeleteAccount,
}: AccountSectionProps) {
  return (
    <View>
      <SectionHeader title="Account" />
      <Card padding="none" elevation="sm" radius="lg">
        <SettingRow
          icon={<KeyRound size={18} color={palette.green[700]} />}
          label="Change password"
          onPress={onChangePassword}
        />
        <SettingDivider />
        <SettingRow icon={<Info size={18} color={palette.sageScale[700]} />} label="About Sprout" onPress={onAbout} />
        <SettingDivider />
        <SettingRow icon={<Shield size={18} color={palette.green[700]} />} label="Privacy policy" onPress={onPrivacy} />
        <SettingDivider />
        <SettingRow icon={<FileText size={18} color={colors.text.muted} />} label="Terms of service" onPress={onTerms} />
        <SettingDivider />
        <SettingRow icon={<Info size={18} color={colors.text.subtle} />} label="App version" value={version} />
        <SettingDivider />
        <SettingRow icon={<Trash2 size={18} color={colors.text.subtle} />} label="Delete account" onPress={onDeleteAccount} />
        <SettingDivider />
        <SettingRow
          icon={<LogOut size={18} color={colors.status.danger} />}
          label="Sign out"
          onPress={onSignOut}
          danger
        />
      </Card>
    </View>
  );
}

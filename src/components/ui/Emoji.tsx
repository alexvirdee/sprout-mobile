/**
 * Emoji — renders an emoji glyph at an exact size without clipping.
 *
 * RN <Text> inherits a line height from its type variant, so a large emoji
 * dropped into a small line box (e.g. a 44px emoji inside body's 26px line) gets
 * its top and bottom shaved off. Emoji pins `lineHeight` ≥ `fontSize` and centers
 * the glyph so it always renders whole — use it anywhere an emoji is shown big.
 */

import React from 'react';
import { Platform, StyleProp, Text as RNText, TextStyle } from 'react-native';

export interface EmojiProps {
  children: string;
  /** Glyph size in px (drives both fontSize and a safe lineHeight). */
  size?: number;
  /** Emoji are decorative by default; pass a label to expose it to a11y. */
  label?: string;
  style?: StyleProp<TextStyle>;
}

export function Emoji({ children, size = 24, label, style }: EmojiProps) {
  return (
    <RNText
      allowFontScaling={false}
      accessible={!!label}
      accessibilityLabel={label}
      style={[
        {
          fontSize: size,
          lineHeight: Math.ceil(size * 1.2),
          textAlign: 'center',
          ...(Platform.OS === 'android' ? { includeFontPadding: false } : null),
        },
        style,
      ]}
    >
      {children}
    </RNText>
  );
}

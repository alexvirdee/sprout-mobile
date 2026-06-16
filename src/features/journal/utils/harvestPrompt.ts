/**
 * confirmLogHarvest — gentle "want to log what you picked?" prompt shown after a
 * harvesting care task is completed. Kept here so every completion path (task
 * detail, calendar) offers the same loop without duplicating copy.
 */

import { Alert } from 'react-native';

export function confirmLogHarvest(opts: { onLog: () => void; onDismiss?: () => void }) {
  Alert.alert('Nice harvest! 🧺', 'Want to log what you picked?', [
    { text: 'Not now', style: 'cancel', onPress: opts.onDismiss },
    { text: 'Log harvest', onPress: opts.onLog },
  ]);
}

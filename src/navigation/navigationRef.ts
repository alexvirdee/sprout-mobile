/**
 * navigationRef — an app-wide navigation handle so non-React code (e.g. a
 * notification tap handler) can navigate without a screen's navigation prop.
 */

import { createNavigationContainerRef } from '@react-navigation/native';

import { AppTabParamList } from '@app-types/navigation';

export const navigationRef = createNavigationContainerRef<AppTabParamList>();

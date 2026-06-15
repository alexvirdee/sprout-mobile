/**
 * Navigation param lists. The root flow is driven by auth + onboarding state
 * (see RootNavigator); the Auth and App navigators have their own param lists.
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import type { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  SignIn: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

export type AppTabParamList = {
  Home: undefined;
  Garden: NavigatorScreenParams<GardensStackParamList> | undefined;
  Water: NavigatorScreenParams<WateringStackParamList> | undefined;
  You: NavigatorScreenParams<ProfileStackParamList> | undefined;
};

export type AuthStackScreenProps<T extends keyof AuthStackParamList> = NativeStackScreenProps<
  AuthStackParamList,
  T
>;

export type AppTabScreenProps<T extends keyof AppTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<AppTabParamList, T>,
  NativeStackScreenProps<AuthStackParamList>
>;

export type GardensStackParamList = {
  GardensList: { flash?: string } | undefined;
  GardenDetail: { id: string; flash?: string };
  CreateGarden: undefined;
  EditGarden: { id: string };
  AddPlant: { gardenId?: string; name?: string } | undefined;
  PlantDetail: { id: string; flash?: string };
  EditPlant: { id: string };
};

export type GardensStackScreenProps<T extends keyof GardensStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<GardensStackParamList, T>,
  AppTabScreenProps<keyof AppTabParamList>
>;

export type WateringStackParamList = {
  WateringHome: undefined;
  WateringHistory: undefined;
  LogWatering: { gardenId: string };
};

export type WateringStackScreenProps<T extends keyof WateringStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<WateringStackParamList, T>,
  AppTabScreenProps<keyof AppTabParamList>
>;

export type ProfileStackParamList = {
  ProfileHome: { flash?: string } | undefined;
  EditProfile: undefined;
  Achievements: undefined;
  Preferences: undefined;
  About: undefined;
};

export type ProfileStackScreenProps<T extends keyof ProfileStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, T>,
  AppTabScreenProps<keyof AppTabParamList>
>;

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends AppTabParamList {}
  }
}

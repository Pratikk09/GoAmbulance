import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {NativeStackScreenProps} from '@react-navigation/native-stack';

export type AppStackParamList = {
  SplashScreen: undefined;
  AuthNavigator: undefined;
  MainNavigator: undefined;
};

export type SplashScreenProps = NativeStackScreenProps<
  AppStackParamList,
  'SplashScreen'
>;
export type AuthNavigatorProps = NativeStackScreenProps<
  AppStackParamList,
  'AuthNavigator'
>;
export type MainNavigatorProps = NativeStackScreenProps<
  AppStackParamList,
  'MainNavigator'
>;

export type AuthStackParamList = {
  LoginScreen: undefined;
};

export type LoginScreenProps = NativeStackScreenProps<
  AuthStackParamList,
  'LoginScreen'
>;

export type MainStackParamList = {
  HomeScreen: undefined;
};
export type HomeScreenProps = NativeStackScreenProps<
  MainStackParamList,
  'HomeScreen'
>;

export type BottomTabParamList = {
  HomeTab: undefined;
};

export type HomeTabProps = BottomTabScreenProps<BottomTabParamList, 'HomeTab'>;

export interface IColorTheme {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  tertiary: string;

  textPrimary: string;
  textSecondary: string;

  black: string;
  white: string;
  red: string;
  green: string;
  blueLight: string;

  grey: string;
  greyLight: string;
  greyLighter: string;
  greenLight: string;
  pink: string;
  brown: string;

  inputBackground: string;
  messageBackground: string;
  myMessageBackground: string;
  iconGrey: string;
}
export const LightTheme: IColorTheme = {
  background: '#FFFFFF',
  surface: '#F5F5F5',
  primary: '#58B5DA',
  secondary: '#E7E0A9',
  tertiary: '#2F9EFB',

  textPrimary: '#363636',
  textSecondary: '#7B7B7B',

  black: '#000000',
  white: '#FFFFFF',
  red: 'red',
  green: '#03A63D',
  blueLight: '#D9E8F5',

  grey: '#6C7278',
  greyLight: '#D2D2D2',
  greyLighter: '#E3E3E3',
  greenLight: '#CFF8BA',
  pink: '#E50059',
  brown: '#713E02',

  inputBackground: '#F5F5F5',
  messageBackground: '#E8E8E8',
  myMessageBackground: '#58B5DA',
  iconGrey: '#999999',
};

export const DarkTheme: IColorTheme = {
  background: '#000000',
  surface: '#1C1C1E',
  primary: '#58B5DA',
  secondary: '#E7E0A9',
  tertiary: '#2F9EFB',

  textPrimary: '#FFFFFF',
  textSecondary: '#E0E0E0',

  black: '#FFFFFF',
  white: '#000000',
  red: '#FF453A',
  green: '#32D74B',
  blueLight: '#0A84FF',

  grey: '#8E8E93',
  greyLight: '#48484A',
  greyLighter: '#636366',
  greenLight: '#30D158',
  pink: '#FF375F',
  brown: '#996D3D',

  inputBackground: '#2C2C2E',
  messageBackground: '#1C1C1E',
  myMessageBackground: '#0A84FF',
  iconGrey: '#8E8E93',
};
export const Colors = LightTheme;


export const Themes = {
  light: LightTheme,
  dark: DarkTheme,
};

export type ThemeName = keyof typeof Themes;
export type ColorTheme = typeof LightTheme;
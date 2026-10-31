export interface IColorTheme {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  tertiary: string;

  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  // Text on yellow or green backgrounds must be dark (see docs/DRIVER_APP_UI_PLAN.md).
  textOnAccent: string;

  black: string;
  white: string;
  red: string;
  yellow: string;
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

// Driver app palette from docs/DRIVER_APP_UI_PLAN.md, section 2.
// Dark background is easier to read in a vehicle.
export const DriverTheme: IColorTheme = {
  background: '#0F172A',
  surface: '#1E293B',
  primary: '#4F46E5',
  secondary: '#334155',
  tertiary: '#6366F1',

  textPrimary: '#F8FAFC',
  textSecondary: '#94A3B8',
  textMuted: '#94A3B8',
  textOnAccent: '#0F172A',

  black: '#000000',
  white: '#FFFFFF',
  red: '#EF4444',
  yellow: '#F59E0B',
  green: '#10B981',
  blueLight: '#312E81',

  grey: '#64748B',
  greyLight: '#334155',
  greyLighter: '#475569',
  greenLight: '#064E3B',
  pink: '#EC4899',
  brown: '#92400E',

  inputBackground: '#1E293B',
  messageBackground: '#1E293B',
  myMessageBackground: '#4F46E5',
  iconGrey: '#94A3B8',
};

export const Colors = DriverTheme;

// The plan has no light/dark switch this weekend, so both modes use the driver palette.
export const Themes = {
  light: DriverTheme,
  dark: DriverTheme,
};

export type ThemeName = keyof typeof Themes;
export type ColorTheme = typeof DriverTheme;

import { ThemeName } from '@constant/colors';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Appearance } from 'react-native';

// Detect system theme
const systemScheme = Appearance.getColorScheme(); // 'light' | 'dark' | null

interface ThemeState {
  mode: ThemeName;
}

const initialState: ThemeState = {
  mode: systemScheme === 'dark' ? 'dark' : 'light',
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === 'light' ? 'dark' : 'light';
    },
    setTheme: (state, action: PayloadAction<ThemeName>) => {
      state.mode = action.payload;
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export const themeReducer = themeSlice.reducer;

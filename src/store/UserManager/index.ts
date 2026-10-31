import {createSlice} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';

const initialState: UserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'app/user',
  initialState,
  reducers: {
    userLogout: state => {
      state.user = null;
      AsyncStorage.removeItem('accessToken');
      AsyncStorage.removeItem('refreshToken');
    },
    updateUser: (state, {payload}) => {
      state.user = payload;
    },
  },
  extraReducers: builder => {},
});

export const userReducer = userSlice.reducer;
export const {userLogout, updateUser} = userSlice.actions;

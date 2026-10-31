import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {userLogout} from '../UserManager';

const initialState: DriverState = {
  onlineSince: null,
  socketConnected: false,
};

const driverSlice = createSlice({
  name: 'app/driver',
  initialState,
  reducers: {
    setOnlineSince: (state, {payload}: PayloadAction<number | null>) => {
      state.onlineSince = payload;
    },
    setSocketConnected: (state, {payload}: PayloadAction<boolean>) => {
      state.socketConnected = payload;
    },
  },
  extraReducers: builder => {
    builder.addCase(userLogout, () => initialState);
  },
});

export const driverReducer = driverSlice.reducer;
export const {setOnlineSince, setSocketConnected} = driverSlice.actions;

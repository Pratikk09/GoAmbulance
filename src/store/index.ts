import {configureStore} from '@reduxjs/toolkit';
import {TypedUseSelectorHook, useDispatch, useSelector} from 'react-redux';
import {createLogger} from 'redux-logger';
import {persistReducer, persistStore} from 'redux-persist';
import {combineReducers} from '@reduxjs/toolkit';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {api, apiMiddleware, apiReducer} from '@rtkServices/index';
import {userReducer} from './UserManager';
import { themeReducer } from './ThemeManger';

const logger = createLogger({
  duration: true,
  predicate: (getState, action) => {
    if (action.type.includes('persist')) {
      return false;
    } else {
      console.log('REDUX-TOOLKIT:- ', action.type);
      return false;
    }
  },
});

const rootReducer = combineReducers({
  [api.reducerPath]: apiReducer,
  user: userReducer,
  theme: themeReducer
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['user' , 'theme'],
  blacklist: [],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer, //rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
        warnAfter: 100,
      },
    }).concat(apiMiddleware, logger),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

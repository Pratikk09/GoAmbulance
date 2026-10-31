import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {AppStackParamList} from './screens';
import SplashScreen from '@container/SplashScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { navigationRef } from './utils';
import IncomingJobModal from '@components/IncomingJobModal/IncomingJobModal';
import {useJobAlerts} from '@hooks/useJobAlerts';
import {useDriverSession} from '@hooks/useDriverSession';

const AppStack = createNativeStackNavigator<AppStackParamList>();

export default function Application() {
  useJobAlerts();
  useDriverSession();

  return (
    <NavigationContainer ref={navigationRef}>
      <AppStack.Navigator>
        <AppStack.Screen
          name="SplashScreen"
          component={SplashScreen}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="AuthNavigator"
          component={AuthNavigator}
          options={{headerShown: false}}
        />
        <AppStack.Screen
          name="MainNavigator"
          component={MainNavigator}
          options={{headerShown: false}}
        />
      </AppStack.Navigator>
      {/* Shown over any screen when a job offer comes in. */}
      <IncomingJobModal />
    </NavigationContainer>
  );
}

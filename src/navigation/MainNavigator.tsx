import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainStackParamList} from './screens';
import BottomTabNavigator from './BottomTabNavigator';

const MainStack = createNativeStackNavigator<MainStackParamList>();

// Push notifications are handled app-wide by useJobAlerts and index.js.
export default function MainNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name={'HomeScreen'}
        options={{headerShown: false}}
        component={BottomTabNavigator}
      />
    </MainStack.Navigator>
  );
}

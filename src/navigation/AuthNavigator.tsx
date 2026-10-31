import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LoginScreen from '@container/AuthContainer/LoginScreen';
import PermissionScreen from '@container/AuthContainer/PermissionScreen';
import { AuthStackParamList } from './screens';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export default function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="PermissionScreen"
        component={PermissionScreen}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
}

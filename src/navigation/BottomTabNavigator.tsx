import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeScreen from '@container/MainContainer/HomeScreen';
import {BottomTabParamList} from './screens';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {backgroundColor: '#0E0D13', height: 70},
        tabBarActiveTintColor: 'white',
      }}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

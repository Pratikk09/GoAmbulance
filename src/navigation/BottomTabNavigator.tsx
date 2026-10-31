import React from 'react';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import HomeScreen from '@container/MainContainer/HomeScreen';
import BottomTabBar from '@components/BottomTabBar/BottomTabBar';
import {BottomTabParamList} from './screens';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const renderTabBar = (props: BottomTabBarProps) => <BottomTabBar {...props} />;

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{headerShown: false}}
      tabBar={renderTabBar}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
}

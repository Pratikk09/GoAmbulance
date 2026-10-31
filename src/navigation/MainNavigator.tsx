import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {MainStackParamList} from './screens';
import BottomTabNavigator from './BottomTabNavigator';
import notifee, {EventType} from '@notifee/react-native';
import {onMessageReceived} from '@utils/configNotification';
import messaging from '@react-native-firebase/messaging';

const MainStack = createNativeStackNavigator<MainStackParamList>();

export default function MainNavigator() {
  useEffect(() => {
    let lastNotificationId: any = null;
    const handleNotification = async (res: any) => {
      const notificationId = res?.messageId;
      if (notificationId && notificationId !== lastNotificationId) {
        lastNotificationId = notificationId;
        if (res && res !== undefined && res !== null) {
          onMessageReceived(res?.notification);
        }
      }
    };
    // const unsubscribeMessage = messaging().onMessage(handleNotification);
    // return () => {
    //   unsubscribeMessage();
    // };
  }, []);
  useEffect(() => {
    notifee.onBackgroundEvent(async ({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          console.log('notification preesed drawer------>', detail);
          break;
      }
    });
    return notifee.onForegroundEvent(async ({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          break;
        case EventType.PRESS:
          break;
      }
    });
  }, []);

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

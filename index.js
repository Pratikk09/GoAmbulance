/**
 * @format
 */

import { AppRegistry } from 'react-native';
import notifee from '@notifee/react-native';
import {
  getMessaging,
  setBackgroundMessageHandler,
} from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';
import {
  createJobAlertChannels,
  handleJobNotificationEvent,
  handleRemoteMessage,
} from '@utils/jobAlert';

// Silent job offers that arrive while the app is in the background or killed.
setBackgroundMessageHandler(getMessaging(), async message => {
  await createJobAlertChannels();
  await handleRemoteMessage(message, false);
});

// Accept/Reject pressed on the notification while the app is in the background.
notifee.onBackgroundEvent(handleJobNotificationEvent);

AppRegistry.registerComponent(appName, () => App);

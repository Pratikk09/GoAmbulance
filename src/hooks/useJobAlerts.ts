import {useEffect} from 'react';
import notifee from '@notifee/react-native';
import {getMessaging, onMessage} from '@react-native-firebase/messaging';
import {
  createJobAlertChannels,
  handleJobNotificationEvent,
  handleRemoteMessage,
  syncCurrentOffer,
} from '@utils/jobAlert';

// Foreground side of push offers; the background side is registered in index.js.
export const useJobAlerts = () => {
  useEffect(() => {
    createJobAlertChannels();
    // Covers opening the app from the push or the lock-screen alert.
    syncCurrentOffer();

    const unsubscribeMessage = onMessage(getMessaging(), message =>
      handleRemoteMessage(message, true),
    );
    const unsubscribeNotifee = notifee.onForegroundEvent(
      handleJobNotificationEvent,
    );

    return () => {
      unsubscribeMessage();
      unsubscribeNotifee();
    };
  }, []);
};

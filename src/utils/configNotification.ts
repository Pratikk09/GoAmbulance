import notifee, {AndroidImportance} from '@notifee/react-native';
export const PRESS_ID = 'PRESS_ID';

export function createChannels() {
  notifee.createChannel({
    id: 'notification',
    name: 'notification',
    lights: false,
    vibration: true,
    importance: AndroidImportance.HIGH,
    sound: 'default',
  });
}

export async function onMessageReceived(notificationData: any) {
  try {
    await notifee.displayNotification({
      title: notificationData?.title,
      body: notificationData?.body,
      android: {
        channelId: 'notification',
        importance: AndroidImportance.HIGH,
        color: '#19A7CE',
        pressAction: {
          id: PRESS_ID,
          launchActivity: 'default',
        },
      },
      ios: {},
      data: {notificationData},
    });
  } catch (e) {
    console.log('e', e);
  }
}

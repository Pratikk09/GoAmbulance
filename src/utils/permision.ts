import {Alert, Linking, Platform} from 'react-native';
import {
  request,
  RESULTS,
  checkNotifications,
  requestNotifications,
  openSettings,
  check,
} from 'react-native-permissions';

export const Camera = 'Camera';
export const MediaLibrary = 'MediaLibrary';
export const PhotoLibrary = 'PhotoLibrary';

// Notification Permissions
export const requestNotificationPermission = async () => {
  try {
    let permissionGranted = false;

    while (!permissionGranted) {
      const {status} = await checkNotifications();
      if (status === 'granted') {
        console.log('Notification permission already granted');
        return true;
      }
      if (status === 'blocked') {
        console.log('Notification permission blocked');
        showSettingsAlert();
        return false;
      }
      const {status: newStatus} = await requestNotifications([
        'alert',
        'sound',
        'badge',
      ]);
      if (newStatus === 'granted') {
        console.log('Notification permission granted');
        permissionGranted = true;
        return true;
      }
      if (newStatus === 'blocked') {
        console.log('Notification permission blocked after request');
        showSettingsAlert();
        return false;
      }
      console.log('User denied permission, requesting again...');
    }
  } catch (error) {
    console.error(
      'Error checking or requesting notification permission:',
      error,
    );
    return false;
  }
};
export const showSettingsAlert = () => {
  Alert.alert(
    'Enable Notifications',
    'Notifications are disabled. Please enable them in settings to get orders.',
    [
      {
        text: 'Open Settings',
        onPress: () => {
          if (Platform.OS === 'ios') {
            Linking.openURL('app-settings:');
          } else {
            Linking.openSettings();
          }
        },
      },
    ],
  );
};

// Camera and Galary Permissions
export const CheckPermission = async (permissionType: any) => {
  try {
    const result = await check(permissionType);
    switch (result) {
      case RESULTS.DENIED:
        return requestPermission(permissionType);
      case RESULTS.GRANTED:
        return true;
      case RESULTS.BLOCKED:
        return requestPermission(permissionType);
    }
  } catch (error) {
    return false;
  }
};
export const requestPermission = async (permissionType: any) => {
  let msg = 'Please enable the required permission in your app settings.';
  try {
    const result = await request(permissionType);
    if (result === RESULTS.BLOCKED) {
      openSetting(msg);
      return false;
    } else if (result === RESULTS.DENIED) {
      return false;
    } else if (result === RESULTS.GRANTED) {
      return true;
    }
  } catch (error) {
    return false;
  }
};
export const openSetting = (msg: string) => {
  Alert.alert('Permission Blocked', msg, [
    {
      text: 'Cancel',
      style: 'cancel',
      onPress: () => {},
    },
    {
      text: 'Open Settings',
      onPress: () => openSettings(),
    },
  ]);
};

import {Linking, NativeModules, Platform} from 'react-native';
import Geolocation, {
  GeolocationResponse,
} from '@react-native-community/geolocation';
import {
  PERMISSIONS,
  RESULTS,
  check,
  checkMultiple,
  request,
} from 'react-native-permissions';
import {openSetting} from '@utils/permision';

export const LOCATION_PERMISSION =
  Platform.OS === 'ios'
    ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
    : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;

// Matches GeolocationError codes.
export const LOCATION_PERMISSION_DENIED = 1;

// Android 12+ lets the user grant only "approximate" location, which is still enough to go online.
export async function hasLocationPermission() {
  if (Platform.OS === 'ios') {
    return (await check(LOCATION_PERMISSION)) === RESULTS.GRANTED;
  }
  const statuses = await checkMultiple([
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
  ]);
  return Object.values(statuses).includes(RESULTS.GRANTED);
}

// Asks the OS whether the phone's location setting is on. Loaded lazily: the module throws
// on import when the app binary was built without it, and that must not break the screen.
async function isLocationServiceOn() {
  // Checked first because Metro reports a throwing import even inside try/catch.
  if (!NativeModules.RNDeviceInfo) {
    console.log('react-native-device-info is not in this build; rebuild the app');
    return true;
  }
  try {
    const DeviceInfo = require('react-native-device-info').default;
    return await DeviceInfo.isLocationEnabled();
  } catch (error) {
    console.log('react-native-device-info unavailable; rebuild the app', error);
    return true;
  }
}

// True when the app may use location and the phone's location setting is on.
// Asks the OS directly: on Android the fused provider reports "unavailable" while it has
// no fix yet (e.g. indoors), which doesn't mean GPS is off.
export async function isLocationUsable() {
  return (await hasLocationPermission()) && isLocationServiceOn();
}

const requestPosition = (enableHighAccuracy: boolean, maximumAge: number) =>
  new Promise<GeolocationResponse>((resolve, reject) =>
    Geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy,
      timeout: 10000,
      maximumAge,
    }),
  );

// Best available fix: precise first, then a coarse or recent cached one (up to 5 minutes old).
export async function getCurrentPosition() {
  try {
    return await requestPosition(true, 60000);
  } catch (error: any) {
    if (error?.code === LOCATION_PERMISSION_DENIED) {
      throw error;
    }
    return requestPosition(false, 5 * 60000);
  }
}

// "Enable Location": ask for the permission, or open the phone's location settings.
export async function enableLocation() {
  if (!(await hasLocationPermission())) {
    const status = await check(LOCATION_PERMISSION);
    if (status === RESULTS.BLOCKED) {
      openSetting(
        'Location is turned off for GoAmbulance. Please allow it in settings.',
      );
    } else {
      await request(LOCATION_PERMISSION);
    }
    return;
  }
  if (Platform.OS === 'android') {
    await Linking.sendIntent('android.settings.LOCATION_SOURCE_SETTINGS');
  } else {
    await Linking.openSettings();
  }
}

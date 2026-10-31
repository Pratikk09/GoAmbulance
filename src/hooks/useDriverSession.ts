import {useEffect} from 'react';
import {AppState} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  getMessaging,
  getToken as getFcmToken,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import {useAppDispatch, useAppSelector} from '@store/index';
import {driverApi} from '@rtkServices/DriverService';
import {
  socket,
  socketDisconnect,
  socketEmit,
  socketListen,
  socketService,
} from '@socket/index';
import {offerExpired, receiveOffer} from '@utils/jobAlert';
import {showToast} from '@utils/general';

// Dispatch ignores ambulances whose location is older than 5 minutes; the API asks for 5–10 s.
const LOCATION_INTERVAL_MS = 10000;

Geolocation.setRNConfiguration({
  skipPermissionRequests: true,
  locationProvider: 'auto',
});

// Everything a logged-in driver needs running in the background of the UI:
// socket events, push token registration, offer sync and the location heartbeat.
export const useDriverSession = () => {
  const dispatch = useAppDispatch();
  const isLoggedIn = useAppSelector(state => !!state.user.user);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    let watchId: number | null = null;
    let lastSentAt = 0;

    const sendLocation = (position: any) => {
      const now = Date.now();
      if (now - lastSentAt < LOCATION_INTERVAL_MS) {
        return;
      }
      lastSentAt = now;
      const {latitude, longitude, heading, speed} = position.coords;
      const body = {
        latitude,
        longitude,
        heading: heading ?? undefined,
        speed: speed ?? undefined,
      };
      if (socket?.connected) {
        socketEmit('ambulance:location', body, res => {
          if (!res?.ok) {
            console.log('ambulance:location rejected', res?.error);
          }
        });
      } else {
        dispatch(driverApi.endpoints.sendDriverLocation.initiate(body));
      }
    };

    const startLocation = () => {
      if (watchId !== null) {
        return;
      }
      watchId = Geolocation.watchPosition(
        sendLocation,
        error => {
          console.log('Location error', error.message);
          // Not allowed yet (e.g. before the Permissions screen): retry on the next resume.
          if (error.code === error.PERMISSION_DENIED) {
            stopLocation();
          }
        },
        {
          enableHighAccuracy: true,
          distanceFilter: 0,
          interval: LOCATION_INTERVAL_MS,
          fastestInterval: LOCATION_INTERVAL_MS / 2,
        },
      );
    };

    const stopLocation = () => {
      if (watchId !== null) {
        Geolocation.clearWatch(watchId);
        watchId = null;
      }
    };

    // GET /me restores state on app start: pending offer, and whether the driver is online.
    const restoreState = async () => {
      try {
        const me = await dispatch(
          driverApi.endpoints.getDriverMe.initiate(undefined, {
            forceRefetch: true,
            subscribe: false,
          }),
        ).unwrap();
        if (me.offer) {
          await receiveOffer(me.offer, AppState.currentState === 'active');
        }
        // TODO: also stream while on a trip once the trip screens exist.
        if (me.ambulance?.status === 'AVAILABLE' || me.activeTrip) {
          startLocation();
        } else {
          stopLocation();
        }
      } catch (error: any) {
        console.log('GET /me failed', error?.data?.message || error);
      }
    };

    const registerPushToken = (token: string) =>
      dispatch(
        driverApi.endpoints.registerPushToken.initiate({token, platform: 'fcm'}),
      );

    socketService().then(() => {
      socketListen('ambulance:offer', (offer: IAmbulanceOffer) =>
        receiveOffer(offer, AppState.currentState === 'active'),
      );
      socketListen('ambulance:offer-expired', ({caseId}: {caseId: string}) =>
        offerExpired(caseId),
      );
      socketListen('ambulance:trip-cancelled', () =>
        // TODO: leave the trip screens once they exist.
        showToast('The clinic cancelled this trip'),
      );
    });

    const messaging = getMessaging();
    getFcmToken(messaging)
      .then(token => {
        if (__DEV__) {
          console.log('FCM token:', token);
        }
        registerPushToken(token);
      })
      .catch(error => console.log('FCM token error:', error));
    const unsubscribeToken = onTokenRefresh(messaging, registerPushToken);

    restoreState();
    const appStateSubscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        restoreState();
      }
    });

    return () => {
      unsubscribeToken();
      appStateSubscription.remove();
      stopLocation();
      socketDisconnect();
    };
  }, [isLoggedIn, dispatch]);
};

import {useEffect} from 'react';
import {AppState} from 'react-native';
import Geolocation from '@react-native-community/geolocation';
import {
  getMessaging,
  getToken as getFcmToken,
  onTokenRefresh,
} from '@react-native-firebase/messaging';
import {useAppDispatch, useAppSelector} from '@store/index';
import {setSocketConnected} from '@store/DriverManager';
import {driverApi, useGetDriverMeQuery} from '@rtkServices/DriverService';
import {
  socket,
  socketDisconnect,
  socketEmit,
  socketListen,
  socketService,
} from '@socket/index';
import {offerExpired, receiveOffer} from '@utils/jobAlert';
import {showToast} from '@utils/general';
import {LOCATION_PERMISSION_DENIED} from '@utils/location';

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
  // GET /me restores state on app start and after every status change (cache tag).
  const {data: me, refetch} = useGetDriverMeQuery(undefined, {
    skip: !isLoggedIn,
  });
  const pendingOffer = me?.offer;
  const shouldShareLocation =
    ['AVAILABLE', 'BUSY'].includes(me?.ambulance?.status) || !!me?.activeTrip;

  // Socket, push token and refresh-on-resume, for as long as the driver is logged in.
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }
    const registerPushToken = (token: string) =>
      dispatch(
        driverApi.endpoints.registerPushToken.initiate({token, platform: 'fcm'}),
      );

    dispatch(setSocketConnected(false));
    socketService().then(() => {
      socketListen('connect', () => {
        dispatch(setSocketConnected(true));
        // Catch up on anything missed while disconnected.
        refetch();
      });
      socketListen('disconnect', () => dispatch(setSocketConnected(false)));
      socketListen('ambulance:offer', (offer: IAmbulanceOffer) =>
        receiveOffer(offer, AppState.currentState === 'active'),
      );
      socketListen('ambulance:offer-expired', ({caseId}: {caseId: string}) =>
        offerExpired(caseId),
      );
      socketListen('ambulance:trip-cancelled', () => {
        // TODO: leave the trip screens once they exist.
        showToast('The clinic cancelled this trip');
        refetch();
      });
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

    const appStateSubscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        refetch();
      }
    });

    return () => {
      unsubscribeToken();
      appStateSubscription.remove();
      socketDisconnect();
      dispatch(setSocketConnected(false));
    };
  }, [isLoggedIn, dispatch, refetch]);

  useEffect(() => {
    if (pendingOffer) {
      receiveOffer(pendingOffer, AppState.currentState === 'active');
    }
  }, [pendingOffer]);

  // Location heartbeat while AVAILABLE or on a trip.
  useEffect(() => {
    if (!isLoggedIn || !shouldShareLocation) {
      return;
    }
    let lastSentAt = 0;
    const watchId = Geolocation.watchPosition(
      position => {
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
      },
      error => {
        console.log('Location error', error.message);
        // Not allowed yet: GET /me runs again on resume, which restarts this effect.
        if (error.code === LOCATION_PERMISSION_DENIED) {
          Geolocation.clearWatch(watchId);
        }
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: LOCATION_INTERVAL_MS,
        fastestInterval: LOCATION_INTERVAL_MS / 2,
      },
    );
    return () => Geolocation.clearWatch(watchId);
  }, [isLoggedIn, shouldShareLocation, dispatch]);
};

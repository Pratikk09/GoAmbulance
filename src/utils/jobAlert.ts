import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
  Event,
  EventType,
} from '@notifee/react-native';
import {Platform} from 'react-native';
import {RemoteMessage} from '@react-native-firebase/messaging';
import {store} from '@store/index';
import {clearIncomingJob, setIncomingJob} from '@store/JobOfferManager';
import {driverApi} from '@rtkServices/DriverService';
import {getToken, showToast} from '@utils/general';

/*
 * Incoming ambulance offers, Rapido/Ola style (see the backend's "Ambulance Driver App — API & Flow").
 *
 * Offers arrive two ways, de-duplicated by caseId:
 *   - socket `ambulance:offer` with the full offer object (app open);
 *   - FCM push with data { type: 'AMBULANCE_OFFER', caseId, expiresAt }, after which
 *     the full offer is fetched from GET /ambulance/driver/offer.
 */
export const AMBULANCE_OFFER_TYPE = 'AMBULANCE_OFFER';
export const JOB_ACCEPT_ACTION = 'job_accept';
export const JOB_REJECT_ACTION = 'job_reject';
const JOB_OPEN_ACTION = 'job_open';
const JOB_IOS_CATEGORY = 'job_offer';

// The backend sends offers on the `emergency` channel. Android channel sounds can't change
// after creation, so a new tone needs a new channel id here and on the backend.
const JOB_CHANNEL_ID = 'emergency';
// Used while the app is open: plays the tone without a heads-up banner over the popup.
const JOB_CHANNEL_IN_APP_ID = 'emergency_in_app';
const ALERT_SOUND = 'emergency_alert';
const VIBRATION_PATTERN = [400, 600, 400, 600];

const notificationId = (caseId: string) => `ambulance-offer-${caseId}`;

export const offerExpiresAt = (offer: IAmbulanceOffer) =>
  Date.parse(offer.expiresAt);
const isExpired = (offer: IAmbulanceOffer) =>
  offerExpiresAt(offer) <= Date.now();

export async function createJobAlertChannels() {
  if (Platform.OS === 'android') {
    await notifee.createChannel({
      id: JOB_CHANNEL_ID,
      name: 'Emergency requests',
      importance: AndroidImportance.HIGH,
      visibility: AndroidVisibility.PUBLIC,
      sound: ALERT_SOUND,
      vibration: true,
      vibrationPattern: VIBRATION_PATTERN,
      bypassDnd: true,
    });
    await notifee.createChannel({
      id: JOB_CHANNEL_IN_APP_ID,
      name: 'Emergency requests while the app is open',
      importance: AndroidImportance.DEFAULT,
      sound: ALERT_SOUND,
      vibration: true,
      vibrationPattern: VIBRATION_PATTERN,
    });
  } else {
    await notifee.setNotificationCategories([
      {
        id: JOB_IOS_CATEGORY,
        actions: [
          {id: JOB_ACCEPT_ACTION, title: 'Accept', foreground: true},
          {id: JOB_REJECT_ACTION, title: 'Reject', destructive: true},
        ],
      },
    ]);
  }
}

async function showJobAlert(offer: IAmbulanceOffer, appInForeground: boolean) {
  await notifee.displayNotification({
    id: notificationId(offer.caseId),
    title: offer.distanceKm
      ? `Emergency pickup · ${offer.distanceKm} km`
      : 'Emergency pickup',
    body: offer.triageSummary,
    data: {
      type: AMBULANCE_OFFER_TYPE,
      caseId: offer.caseId,
      offer: JSON.stringify(offer),
    },
    android: {
      channelId: appInForeground ? JOB_CHANNEL_IN_APP_ID : JOB_CHANNEL_ID,
      importance: appInForeground
        ? AndroidImportance.DEFAULT
        : AndroidImportance.HIGH,
      category: AndroidCategory.CALL,
      visibility: AndroidVisibility.PUBLIC,
      color: '#E0383E',
      // Ring until the driver answers or the offer times out, like an incoming call.
      loopSound: true,
      ongoing: true,
      autoCancel: false,
      timeoutAfter: Math.max(offerExpiresAt(offer) - Date.now(), 1000),
      pressAction: {id: JOB_OPEN_ACTION, launchActivity: 'default'},
      // Opens the app straight onto the popup when the phone is locked.
      fullScreenAction: appInForeground
        ? undefined
        : {id: JOB_OPEN_ACTION, launchActivity: 'default'},
      actions: [
        {title: 'Reject', pressAction: {id: JOB_REJECT_ACTION}},
        {
          title: 'Accept',
          pressAction: {id: JOB_ACCEPT_ACTION, launchActivity: 'default'},
        },
      ],
    },
    ios: {
      categoryId: JOB_IOS_CATEGORY,
      sound: `${ALERT_SOUND}.wav`,
      interruptionLevel: 'timeSensitive',
    },
  });
}

// Shows the popup and rings, unless this case is already on screen.
export async function receiveOffer(
  offer: IAmbulanceOffer,
  appInForeground: boolean,
) {
  if (isExpired(offer)) {
    return;
  }
  if (store.getState().jobOffer.incomingJob?.caseId === offer.caseId) {
    return;
  }
  store.dispatch(setIncomingJob(offer));
  await showJobAlert(offer, appInForeground);
}

async function fetchCurrentOffer() {
  return store
    .dispatch(
      driverApi.endpoints.getCurrentOffer.initiate(undefined, {
        forceRefetch: true,
        subscribe: false,
      }),
    )
    .unwrap();
}

export async function handleRemoteMessage(
  message: RemoteMessage,
  appInForeground: boolean,
) {
  const data = message.data;
  if (data?.type !== AMBULANCE_OFFER_TYPE || !data.caseId) {
    return;
  }
  try {
    const offer = await fetchCurrentOffer();
    if (offer?.caseId === data.caseId) {
      await receiveOffer(offer, appInForeground);
    }
  } catch (error) {
    console.log('Could not load the offer from the push', error);
  }
}

// `ambulance:offer-expired`: timed out or released by the clinic.
export async function offerExpired(caseId: string) {
  await notifee.cancelNotification(notificationId(caseId));
  if (store.getState().jobOffer.incomingJob?.caseId === caseId) {
    store.dispatch(clearIncomingJob());
  }
}

const safeToast = (message: string) => {
  try {
    showToast(message);
  } catch {
    // No UI when running headless in the background.
  }
};

// Returns false when the popup should stay open (e.g. the network failed on Accept).
export async function respondToJob(
  caseId: string,
  response: 'accepted' | 'rejected' | 'missed',
) {
  try {
    if (response === 'accepted') {
      await store.dispatch(driverApi.endpoints.acceptOffer.initiate(caseId)).unwrap();
      // TODO: open the Drive to Patient screen with the returned trip.
      safeToast('Trip accepted');
    } else if (response === 'rejected') {
      await store.dispatch(driverApi.endpoints.declineOffer.initiate(caseId)).unwrap();
    }
  } catch (error: any) {
    if (error?.status === 409) {
      safeToast('Request no longer available');
    } else if (response === 'accepted') {
      safeToast(error?.data?.message || 'Could not accept. Please try again.');
      return false;
    }
    // A failed decline still closes the popup: the server re-offers after 30 s anyway.
  }
  await offerExpired(caseId);
  return true;
}

// Handles taps and Accept/Reject buttons on the notification, foreground or background.
export async function handleJobNotificationEvent({type, detail}: Event) {
  const raw = detail.notification?.data?.offer;
  if (typeof raw !== 'string') {
    return;
  }
  const offer: IAmbulanceOffer = JSON.parse(raw);
  if (type === EventType.ACTION_PRESS) {
    if (detail.pressAction?.id === JOB_ACCEPT_ACTION) {
      await respondToJob(offer.caseId, 'accepted');
    } else if (detail.pressAction?.id === JOB_REJECT_ACTION) {
      await respondToJob(offer.caseId, 'rejected');
    }
  } else if (type === EventType.PRESS && !isExpired(offer)) {
    store.dispatch(setIncomingJob(offer));
  }
}

// When the app opens (from a push, the lock screen, or the launcher) the server is the
// source of truth: show its pending offer, or close a popup that is no longer valid.
export async function syncCurrentOffer() {
  const {accessToken} = await getToken();
  if (!accessToken) {
    return;
  }
  try {
    const offer = await fetchCurrentOffer();
    const shown = store.getState().jobOffer.incomingJob;
    if (offer) {
      await receiveOffer(offer, true);
    } else if (shown) {
      await offerExpired(shown.caseId);
    }
  } catch (error) {
    console.log('Could not sync the current offer', error);
  }
}

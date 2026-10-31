// TODO: set to the backend's address. 10.0.2.2 is the host machine from the Android emulator;
// on a real phone use the computer's LAN IP (e.g. http://192.168.1.20:3000).
export const API_HOST = 'https://19sntv0h-3000.inc1.devtunnels.ms';
export const BASE_URL = `${API_HOST}/api/v1/`;
// Socket.IO namespace for driver events.
export const SOCKET_URL = `${API_HOST}/events`;

// AUTH MODULE APIs And USER MODULE ---------------------------------------------->
export const SIGNUP_URL = '';
export const LOGIN_URL = 'auth/login';

// AMBULANCE DRIVER APIs ---------------------------------------------->
export const DRIVER_ME_URL = 'ambulance/driver/me';
export const DRIVER_STATUS_URL = 'ambulance/driver/me/status';
export const DRIVER_LOCATION_URL = 'ambulance/driver/me/location';
export const DRIVER_PUSH_TOKEN_URL = 'ambulance/driver/me/push-token';
export const DRIVER_OFFER_URL = 'ambulance/driver/offer';
export const driverCaseUrl = (caseId: string, action: string) =>
  `ambulance/driver/cases/${caseId}/${action}`;

// FILE UPLOAD APIs ---------------------------------------------->
export const UPLOAD_IMAGE = 'file/upload';
export const GET_PRE_SIGNED_URL = 'file/generate-presigned-url';
export const S3_UPLOAD_URL = '';

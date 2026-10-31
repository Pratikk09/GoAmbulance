import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL, LOGIN_URL} from './endpoints';
import {getToken, showToast} from '@utils/general';
import {userLogout} from '@store/UserManager';
import {navigateAndSimpleReset} from '@navigation/utils';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async headers => {
    const {accessToken: token} = await getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    } else if (__DEV__) {
      console.log('API request sent without a token (not logged in yet?)');
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result: any = await baseQuery(args, api, extraOptions);
  if (result.error) {
    const {status} = result.error;
    // Validation errors (400) send `message` as an array of strings.
    const message = result.error.data?.message;
    if (Array.isArray(message)) {
      result.error.data.message = message[0];
    }
    switch (status) {
      case 400:
        console.error(
          `Bad Request (400): ${
            result.error.data?.message || 'Invalid request syntax.'
          }`,
        );
        break;
      case 401:
        console.error(
          `Unauthorized (401): ${
            result.error.data?.message || 'Authentication required.'
          }`,
        );
        // An expired session sends the driver back to login (a wrong password on login doesn't).
        if ((typeof args === 'string' ? args : args?.url) !== LOGIN_URL) {
          api.dispatch(userLogout());
          navigateAndSimpleReset('AuthNavigator', undefined);
        }
        break;
      case 402:
        console.error(
          `Payment Required (402): ${
            result.error.data?.message || 'Payment is required.'
          }`,
        );
        break;
      case 403:
        console.error(
          `Forbidden (403): ${result.error.data?.message || 'Access denied.'}`,
        );
        // The account has no active ambulance: it can't use the driver app.
        if (api.getState().user?.user) {
          showToast('Your account is not linked to an ambulance. Please contact admin.');
          api.dispatch(userLogout());
          navigateAndSimpleReset('AuthNavigator', undefined);
        }
        break;
      case 404:
        console.error(
          `Not Found (404): ${
            result.error.data?.message || 'Requested resource not found.'
          }`,
        );
        break;
      case 500:
        console.error(
          `Internal Server Error (500): ${
            result.error.data?.message ||
            'Server encountered an unexpected condition.'
          }`,
        );
        break;
      case 503:
        console.error(
          `Service Unavailable (503): ${
            result.error.data?.message || 'Server is temporarily unavailable.'
          }`,
        );
        break;
      default:
    }
  }
  // The backend wraps payloads as {success, message, data}; endpoints only need `data`.
  const body = result.data;
  if (
    body &&
    typeof body === 'object' &&
    'data' in body &&
    ('success' in body || 'message' in body || 'statusCode' in body)
  ) {
    result.data = body.data;
  }
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['DriverMe', 'Trips'],
  endpoints: builder => ({}),
  refetchOnFocus: true,
  refetchOnReconnect: true,
});

export const {reducer: apiReducer, middleware: apiMiddleware} = api;

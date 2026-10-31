import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {BASE_URL} from './endpoints';
import {getToken} from '@utils/general';

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: async headers => {
    const {accessToken: token} = await getToken();
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
  let result: any = await baseQuery(args, api, extraOptions);
  if (result.error) {
    const {status} = result.error;
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
  return result;
};

export const api = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: [],
  endpoints: builder => ({}),
  refetchOnFocus: true,
  refetchOnReconnect: true,
});

export const {reducer: apiReducer, middleware: apiMiddleware} = api;

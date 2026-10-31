import {
  DRIVER_LOCATION_URL,
  DRIVER_ME_URL,
  DRIVER_OFFER_URL,
  DRIVER_PUSH_TOKEN_URL,
  DRIVER_STATUS_URL,
  DRIVER_TRIPS_URL,
  driverCaseUrl,
} from '@rtkServices/endpoints';
import {api} from '../index';

export const driverApi = api.injectEndpoints({
  endpoints: builder => ({
    getDriverMe: builder.query<DriverMeRes, void>({
      query: () => DRIVER_ME_URL,
      providesTags: ['DriverMe'],
    }),
    updateDriverStatus: builder.mutation<any, DriverStatusBody>({
      query: body => ({
        url: DRIVER_STATUS_URL,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['DriverMe'],
    }),
    sendDriverLocation: builder.mutation<any, DriverLocationBody>({
      query: body => ({
        url: DRIVER_LOCATION_URL,
        method: 'POST',
        body,
      }),
    }),
    registerPushToken: builder.mutation<any, PushTokenBody>({
      query: body => ({
        url: DRIVER_PUSH_TOKEN_URL,
        method: 'POST',
        body,
      }),
    }),
    getCurrentOffer: builder.query<IAmbulanceOffer | null, void>({
      query: () => DRIVER_OFFER_URL,
    }),
    acceptOffer: builder.mutation<IAmbulanceTrip, string>({
      query: caseId => ({
        url: driverCaseUrl(caseId, 'accept'),
        method: 'POST',
      }),
      invalidatesTags: ['DriverMe', 'Trips'],
    }),
    declineOffer: builder.mutation<{declined: boolean}, string>({
      query: caseId => ({
        url: driverCaseUrl(caseId, 'decline'),
        method: 'POST',
      }),
    }),
    getTrips: builder.query<IAmbulanceTrip[], {page?: number; limit?: number}>({
      query: ({page = 1, limit = 50}) => ({
        url: DRIVER_TRIPS_URL,
        params: {page, limit},
      }),
      // The list may come bare or inside a paging object.
      transformResponse: (raw: any) =>
        Array.isArray(raw) ? raw : raw?.items ?? raw?.trips ?? raw?.data ?? [],
      providesTags: ['Trips'],
    }),
  }),
});

export const {
  useGetDriverMeQuery,
  useUpdateDriverStatusMutation,
  useSendDriverLocationMutation,
  useRegisterPushTokenMutation,
  useGetCurrentOfferQuery,
  useAcceptOfferMutation,
  useDeclineOfferMutation,
  useGetTripsQuery,
} = driverApi;

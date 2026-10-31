import {LOGIN_URL, SIGNUP_URL} from '@rtkServices/endpoints';
import {api} from '../index';

export const authApi = api.injectEndpoints({
  endpoints: builder => ({
    signup: builder.mutation<SignupRes | null, SignupBoby>({
      query: body => ({
        url: SIGNUP_URL,
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<LoginRes, LoginBody>({
      query: body => ({
        url: LOGIN_URL,
        method: 'POST',
        body,
      }),
      // The API may wrap the payload ({data: {...}}) and name the JWT differently,
      // so read it from any of those places.
      transformResponse: (raw: any): LoginRes => {
        const payload = raw?.data ?? raw;
        const accessToken =
          payload?.accessToken ??
          payload?.access_token ??
          payload?.token ??
          payload?.tokens?.accessToken ??
          payload?.tokens?.access?.token ??
          '';
        if (__DEV__) {
          console.log('Login response keys:', Object.keys(payload ?? {}));
        }
        return {
          accessToken,
          refreshToken: payload?.refreshToken ?? payload?.tokens?.refreshToken ?? '',
          user: payload?.user ?? null,
          clinics: payload?.clinics ?? [],
        };
      },
    }),
  }),
});
export const {useSignupMutation, useLoginMutation} = authApi;

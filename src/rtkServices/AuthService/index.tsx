import {SIGNUP_URL} from '@rtkServices/endpoints';
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
  }),
});
export const {useSignupMutation} = authApi;

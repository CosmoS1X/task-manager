import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { t } from 'i18next';
import type { User, Credentials } from '@/types';
import { showError } from '@/utils/flash';

const transformErrorResponse = (error: FetchBaseQueryError) => {
  const message = (error.data as { message?: string })?.message;
  showError(t(message || 'Unknown error'));
  return error;
};

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    credentials: 'include',
  }),
  endpoints: (builder) => ({
    login: builder.mutation<User, Credentials>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      transformErrorResponse,
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      transformErrorResponse,
    }),
    checkAuth: builder.query<User, void>({
      query: () => ({
        url: '/check-auth',
      }),
      keepUnusedDataFor: 0,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useCheckAuthQuery,
  util: authUtil,
} = authApi;

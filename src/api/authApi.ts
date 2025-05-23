import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, Credentials } from '@/types';
import { transformErrorResponse } from './helpers';

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

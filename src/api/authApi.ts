import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User, Credentials } from '@/types';

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
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
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

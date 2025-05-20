import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { t } from 'i18next';
import type { User } from '@/types';
import { showError } from '@/utils/flash';

const transformErrorResponse = (error: FetchBaseQueryError) => {
  const message = (error.data as { message?: string })?.message;
  showError(t(message || 'Unknown error'));
  return error;
};

export const usersApi = createApi({
  reducerPath: 'users',
  keepUnusedDataFor: 0,
  baseQuery: fetchBaseQuery({ baseUrl: '/api/users' }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/',
      transformErrorResponse,
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/${id}`,
      transformErrorResponse,
    }),
    createUser: builder.mutation<User, Omit<User, 'id' | 'createdAt'>>({
      query: (user) => ({
        url: '/',
        method: 'POST',
        body: user,
      }),
      transformErrorResponse,
    }),
    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: patch,
      }),
      transformErrorResponse,
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      transformErrorResponse,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;

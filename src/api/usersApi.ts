import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { User } from '@/types';

export const usersApi = createApi({
  reducerPath: 'users',
  baseQuery: fetchBaseQuery({ baseUrl: '/api/users' }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/',
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/${id}`,
    }),
    createUser: builder.mutation<User, Omit<User, 'id' | 'createdAt'>>({
      query: (user) => ({
        url: '/',
        method: 'POST',
        body: user,
      }),
    }),
    updateUser: builder.mutation<User, Partial<User> & Pick<User, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
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

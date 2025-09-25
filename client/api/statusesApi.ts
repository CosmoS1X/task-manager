import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Status } from '@/types';
import { transformErrorResponse } from './helpers';

export const statusesApi = createApi({
  reducerPath: 'statuses',
  keepUnusedDataFor: 0,
  baseQuery: fetchBaseQuery({ baseUrl: '/api/statuses' }),
  endpoints: (builder) => ({
    getStatuses: builder.query<Status[], void>({
      query: () => '/',
    }),
    getStatusById: builder.query<Status, number>({
      query: (id) => `/${id}`,
    }),
    createStatus: builder.mutation<Status, Omit<Status, 'id' | 'createdAt'>>({
      query: (status) => ({
        url: '/',
        method: 'POST',
        body: status,
      }),
    }),
    updateStatus: builder.mutation<Status, Partial<Status> & Pick<Status, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    deleteStatus: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      transformErrorResponse,
    }),
  }),
});

export const {
  useGetStatusesQuery,
  useGetStatusByIdQuery,
  useCreateStatusMutation,
  useUpdateStatusMutation,
  useDeleteStatusMutation,
} = statusesApi;

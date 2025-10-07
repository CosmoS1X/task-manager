import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Label } from '@/types';
import { transformErrorResponse } from './helpers';

export const labelsApi = createApi({
  reducerPath: 'labels',
  keepUnusedDataFor: 0,
  baseQuery: fetchBaseQuery({ baseUrl: '/api/labels' }),
  endpoints: (builder) => ({
    getLabels: builder.query<Label[], void>({
      query: () => '/',
    }),
    getLabelById: builder.query<Label, number>({
      query: (id) => `/${id}`,
    }),
    createLabel: builder.mutation<Label, Omit<Label, 'id' | 'createdAt'>>({
      query: (label) => ({
        url: '/',
        method: 'POST',
        body: label,
      }),
    }),
    updateLabel: builder.mutation<Label, Partial<Label> & Pick<Label, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    deleteLabel: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      transformErrorResponse,
    }),
  }),
});

export const {
  useGetLabelsQuery,
  useGetLabelByIdQuery,
  useCreateLabelMutation,
  useUpdateLabelMutation,
  useDeleteLabelMutation,
} = labelsApi;

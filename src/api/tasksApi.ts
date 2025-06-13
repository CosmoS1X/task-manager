import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { Task } from '@/types';

export const tasksApi = createApi({
  reducerPath: 'tasks',
  keepUnusedDataFor: 0,
  baseQuery: fetchBaseQuery({ baseUrl: '/api/tasks' }),
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], void>({
      query: () => '/',
    }),
    getTaskById: builder.query<Task, number>({
      query: (id) => `/${id}`,
    }),
    createTask: builder.mutation<Task, Omit<Task, 'id' | 'creatorId' | 'createdAt'>>({
      query: (task) => ({
        url: '/',
        method: 'POST',
        body: task,
      }),
    }),
    updateTask: builder.mutation<Task, Partial<Task> & Pick<Task, 'id'>>({
      query: ({ id, ...patch }) => ({
        url: `/${id}`,
        method: 'PATCH',
        body: patch,
      }),
    }),
    deleteTask: builder.mutation<void, number>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskByIdQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = tasksApi;

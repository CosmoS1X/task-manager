import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector } from 'react-redux';
import type { TypedUseSelectorHook } from 'react-redux';
import { authApi } from '@/api/authApi';
import { usersApi } from '@/api/usersApi';
import { statusesApi } from '@/api/statusesApi';
import { labelsApi } from '@/api/labelsApi';
import { tasksApi } from '@/api/tasksApi';
import authReducer from './authSlice';
import taskFiltersReducer from './taskFiltersSlice';

export const store = configureStore({
  reducer: {
    [authApi.reducerPath]: authApi.reducer,
    [usersApi.reducerPath]: usersApi.reducer,
    [statusesApi.reducerPath]: statusesApi.reducer,
    [labelsApi.reducerPath]: labelsApi.reducer,
    [tasksApi.reducerPath]: tasksApi.reducer,
    auth: authReducer,
    taskFilters: taskFiltersReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(usersApi.middleware)
    .concat(statusesApi.middleware)
    .concat(labelsApi.middleware)
    .concat(tasksApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

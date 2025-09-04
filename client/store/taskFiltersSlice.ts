/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { TaskFilterParams } from '@/types';

const initialState: TaskFilterParams = {
  status: '',
  executor: '',
  label: '',
  isCreator: false,
};

const taskFiltersSlice = createSlice({
  name: 'taskFilters',
  initialState,
  reducers: {
    setTaskFilters: (state, action: PayloadAction<TaskFilterParams>) => {
      const { status, executor, label, isCreator } = action.payload;
      state.status = status;
      state.executor = executor;
      state.label = label;
      state.isCreator = isCreator;
    },
    resetTaskFilters: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setTaskFilters, resetTaskFilters } = taskFiltersSlice.actions;
export default taskFiltersSlice.reducer;

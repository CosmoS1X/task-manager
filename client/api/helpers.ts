import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { t } from 'i18next';
import { showError } from '@/utils/flash';

export const transformErrorResponse = (error: FetchBaseQueryError) => {
  const message = (error.data as { message?: string })?.message;
  showError(t(message || 'Unknown error'));

  return error;
};

export const isFetchBaseQueryError = (error: unknown): error is FetchBaseQueryError => {
  const isObject = typeof error === 'object' && error !== null;

  return isObject && 'status' in error;
};

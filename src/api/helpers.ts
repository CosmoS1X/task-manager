/* eslint-disable import/prefer-default-export */
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query/react';
import { t } from 'i18next';
import { showError } from '@/utils/flash';

export const transformErrorResponse = (error: FetchBaseQueryError) => {
  const message = (error.data as { message?: string })?.message;
  showError(t(message || 'Unknown error'));
  return error;
};

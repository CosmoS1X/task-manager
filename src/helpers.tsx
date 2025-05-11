import type { FormValues } from '@/components/UserForm';

export const formatDate = (date: string) => new Date(date).toLocaleString();

export const normalizeData = (data: FormValues) => {
  const normalizedEntries = Object.entries(data).map(([key, value]) => {
    if (key === 'email') {
      return [key, value?.trim().toLowerCase()];
    }

    return [key, value?.trim()];
  });

  return Object.fromEntries(normalizedEntries);
};

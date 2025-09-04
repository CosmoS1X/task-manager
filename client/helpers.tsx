import type { User } from './types';

export const formatDate = (date: string) => new Date(date).toLocaleString();

export const capitalize = (string: string) => (
  `${string[0].toUpperCase()}${string.slice(1).toLowerCase()}`
);

export const buildFullName = (user: User | null) => (user ? `${user.firstName} ${user.lastName}` : '');

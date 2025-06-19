import { faker } from '@faker-js/faker';
import Endpoints from '../../server/endpoints';

export const createUserData = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password(),
});

export const createStatusData = () => ({
  name: faker.lorem.word(),
});

export const createLabelData = () => ({
  name: faker.lorem.word(),
});

export const createTaskData = () => ({
  name: faker.lorem.word(),
  description: faker.lorem.text(),
});

export const getUserPath = (id: number) => `${Endpoints.Users}/${id}`;
export const getStatusPath = (id: number) => `${Endpoints.Statuses}/${id}`;
export const getLabelPath = (id: number) => `${Endpoints.Labels}/${id}`;
export const getTaskPath = (id: number) => `${Endpoints.Tasks}/${id}`;
export const getCheckEmailQueryString = (email: string) => `${Endpoints.CheckEmail}?email=${email}`;

type FilterParams = {
  status?: number;
  executor?: number;
  label?: number;
  isCreator?: boolean;
};

export const buildQueryString = (filters: FilterParams) => {
  const searchParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      searchParams.append(key, String(value));
    }
  });

  return `${Endpoints.Tasks}?${searchParams.toString()}`;
};

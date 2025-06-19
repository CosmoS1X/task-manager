import { faker } from '@faker-js/faker';
import Endpoints from '../../server/endpoints';

export const createUser = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password(),
});

export const createStatus = () => ({
  name: faker.lorem.word(),
});

export const createLabel = () => ({
  name: faker.lorem.word(),
});

export const getUserPath = (id: number) => `${Endpoints.Users}/${id}`;
export const getStatusPath = (id: number) => `${Endpoints.Statuses}/${id}`;
export const getLabelPath = (id: number) => `${Endpoints.Labels}/${id}`;
export const getCheckEmailQueryString = (email: string) => `${Endpoints.CheckEmail}?email=${email}`;

import { faker } from '@faker-js/faker';
import Endpoints from './endpoints';

export const createUserData = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password({ length: 10 }),
});

export const createStatusData = () => ({
  name: faker.lorem.word(),
});

export const createLabelData = () => ({
  name: faker.lorem.word(),
});

export const createTaskData = () => ({
  name: faker.lorem.words(3),
  description: faker.lorem.text(),
});

export const getUserPath = (id: number) => `${Endpoints.Users}/${id}`;
export const getStatusPath = (id: number) => `${Endpoints.Statuses}/${id}`;
export const getLabelPath = (id: number) => `${Endpoints.Labels}/${id}`;
export const getTaskPath = (id: number) => `${Endpoints.Tasks}/${id}`;
export const getCheckEmailQueryString = (email: string) => `${Endpoints.CheckEmail}?email=${email}`;

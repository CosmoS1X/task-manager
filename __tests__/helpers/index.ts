/* eslint-disable import/prefer-default-export */
import { faker } from '@faker-js/faker';

export const createUser = () => ({
  firstName: faker.person.firstName(),
  lastName: faker.person.lastName(),
  email: faker.internet.email().toLowerCase(),
  password: faker.internet.password(),
});

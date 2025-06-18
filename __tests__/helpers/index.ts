import { faker } from '@faker-js/faker';

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

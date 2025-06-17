import User from '../../server/models/User';
import encrypt from '../../server/lib/secure';
import { createUser } from '../helpers';

describe('User model', () => {
  let testUser: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  beforeEach(async () => {
    await User.query().delete();
    testUser = createUser();
  });

  it('should create an user', async () => {
    const user = await User.query().insert(testUser);

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.firstName).toBe(testUser.firstName);
    expect(user.lastName).toBe(testUser.lastName);
    expect(user.email).toBe(testUser.email);
    expect(user.passwordDigest).toBe(encrypt(testUser.password));
  });

  it('should verify password correctly', async () => {
    const user = await User.query().insert(testUser);

    expect(user.verifyPassword(testUser.password)).toBeTruthy();
    expect(user.verifyPassword('wrong_password')).toBeFalsy();
  });

  it('should validate required fields', async () => {
    await expect(User.query().insert({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    })).rejects.toThrow();
  });

  it('should validate email format', async () => {
    await expect(User.query().insert({ ...testUser, email: 'invalid_email' })).rejects.toThrow();
  });
});

import User from '../../server/models/User';
import encrypt from '../../server/lib/secure';
import { createUser } from '../helpers';

const testUser = createUser();

describe('User model', () => {
  beforeEach(async () => {
    await User.query().delete();
  });

  it('should create user', async () => {
    const user = await User.query().insert(testUser);

    expect(user).toBeDefined();
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

import User from '../../server/models/User';
import encrypt from '../../server/lib/secure';
import { createUserData } from '../helpers';

describe('User model', () => {
  let userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };

  beforeEach(async () => {
    await User.query().delete();
    userData = createUserData();
  });

  it('should create an user', async () => {
    const user = await User.query().insert(userData);

    expect(user).toBeDefined();
    expect(user.id).toBeDefined();
    expect(user.firstName).toBe(userData.firstName);
    expect(user.lastName).toBe(userData.lastName);
    expect(user.email).toBe(userData.email);
    expect(user.passwordDigest).toBe(encrypt(userData.password));
  });

  it('should verify password correctly', async () => {
    const user = await User.query().insert(userData);

    expect(user.verifyPassword(userData.password)).toBeTruthy();
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
    await expect(User.query().insert({ ...userData, email: 'invalid_email' })).rejects.toThrow();
  });
});

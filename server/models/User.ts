import type { JSONSchema } from 'objection';
import { Model } from '../database';
import encrypt from '../lib/secure';

export default class User extends Model {
  id!: number;

  firstName!: string;

  lastName!: string;

  email!: string;

  passwordDigest!: string;

  createdAt!: string;

  static get tableName() {
    return 'users';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password'],
      properties: {
        id: { type: 'integer' },
        firstName: { type: 'string', minLength: 2, maxLength: 255 },
        lastName: { type: 'string', minLength: 2, maxLength: 255 },
        email: { type: 'string', format: 'email' },
        password: { type: 'string', minLength: 5, maxLength: 255 },
      },
    };
  }

  set password(password: string) {
    this.passwordDigest = encrypt(password);
  }

  verifyPassword(password: string) {
    return encrypt(password) === this.passwordDigest;
  }
}

export type UserType = User;

import { Model } from 'objection';
import encrypt from '@server/lib/secure';

export class User extends Model {
  id!: number;

  firstName!: string;

  lastName!: string;

  email!: string;

  passwordDigest!: string;

  createdAt!: string;

  static get tableName() {
    return 'users';
  }

  setPassword(password: string) {
    this.passwordDigest = encrypt(password);
  }

  verifyPassword(password: string) {
    return encrypt(password) === this.passwordDigest;
  }
}

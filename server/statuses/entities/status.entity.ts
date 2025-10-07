import { Model } from 'objection';

export class Status extends Model {
  id!: number;

  name!: string;

  createdAt!: string;

  static get tableName() {
    return 'statuses';
  }
}

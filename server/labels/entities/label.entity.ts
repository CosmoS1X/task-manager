import { Model } from 'objection';

export class Label extends Model {
  id!: number;

  name!: string;

  createdAt!: string;

  static get tableName() {
    return 'labels';
  }
}

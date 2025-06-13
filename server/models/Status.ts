import type { JSONSchema } from 'objection';
import { Model } from '../database';

export default class Status extends Model {
  id!: number;

  name!: string;

  createdAt!: string;

  static get tableName() {
    return 'statuses';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['name'],
      properties: {
        id: { type: 'integer' },
        name: { type: 'string', minLength: 1, maxLength: 255 },
      },
    };
  }
}

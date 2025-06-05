import type { JSONSchema } from 'objection';
import { Model } from '../database';

export default class Label extends Model {
  id!: number;

  name!: string;

  createdAt!: string;

  static get tableName() {
    return 'labels';
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

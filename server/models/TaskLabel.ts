import type { JSONSchema } from 'objection';
import { Model } from '../database';

export default class TaskLabel extends Model {
  static get tableName() {
    return 'tasks_labels';
  }

  static get jsonSchema(): JSONSchema {
    return {
      type: 'object',
      required: ['taskId', 'labelId'],
      properties: {
        id: { type: 'integer' },
        taskId: { type: 'integer', minimum: 1 },
        labelId: { type: 'integer', minimum: 1 },
      },
    };
  }
}

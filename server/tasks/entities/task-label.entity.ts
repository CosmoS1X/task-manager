import { Model } from 'objection';

export class TaskLabel extends Model {
  id!: number;

  taskId!: number;

  labelId!: number;

  createdAt!: string;

  static get tableName() {
    return 'tasks_labels';
  }
}

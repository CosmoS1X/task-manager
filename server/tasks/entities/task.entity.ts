import { Model, RelationMappings } from 'objection';
import { Status } from '@server/statuses/entities/status.entity';
import { User } from '@server/users/entities/user.entity';
import { Label } from '@server/labels/entities/label.entity';
import { TaskLabel } from './task-label.entity';

export class Task extends Model {
  id!: number;

  name!: string;

  description!: string | null;

  statusId!: number;

  creatorId!: number;

  executorId!: number | null;

  createdAt!: string;

  status?: Status;

  creator?: User;

  executor?: User | null;

  labels?: Label[];

  static get tableName() {
    return 'tasks';
  }

  static get relationMappings(): RelationMappings {
    return {
      status: {
        relation: Model.BelongsToOneRelation,
        modelClass: Status,
        join: {
          from: 'tasks.statusId',
          to: 'statuses.id',
        },
      },
      creator: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.creatorId',
          to: 'users.id',
        },
      },
      executor: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'tasks.executorId',
          to: 'users.id',
        },
      },
      labels: {
        relation: Model.ManyToManyRelation,
        modelClass: Label,
        join: {
          from: 'tasks.id',
          through: {
            modelClass: TaskLabel,
            from: 'tasks_labels.taskId',
            to: 'tasks_labels.labelId',
          },
          to: 'labels.id',
        },
      },
    };
  }
}

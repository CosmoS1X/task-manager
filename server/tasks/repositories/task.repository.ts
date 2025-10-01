import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { Task } from '../entities/task.entity';
import { TaskLabel } from '../entities/task-label.entity';
import { TaskFilterDto } from '../dto/task-filter.dto';
import { CreateTaskDto } from '../dto/create-task.dto';
import { UpdateTaskDto } from '../dto/update-task.dto';

export interface TaskFilterData extends TaskFilterDto {
  creatorId: number;
}

export interface TaskCreateData extends CreateTaskDto {
  creatorId: number;
}

export interface TaskUpdateData extends UpdateTaskDto {
  id: number;
}

@Injectable()
export class TaskRepository extends BaseRepository<Task> {
  protected model = Task;

  private readonly relations = '[status, creator, executor, labels]';

  // eslint-disable-next-line class-methods-use-this
  private createFilters(taskFilterData: TaskFilterData) {
    const { status, executor, label, isCreator, creatorId } = taskFilterData;

    return {
      ...(status && { statusId: status }),
      ...(executor && { executorId: executor }),
      ...(label && { labelId: label }),
      ...(isCreator && { creatorId }),
    };
  }

  async findAll(taskFilterData?: TaskFilterData): Promise<Task[]> {
    const filters = taskFilterData ? this.createFilters(taskFilterData) : {};

    const tasks = await this.model
      .query()
      .withGraphJoined(this.relations)
      .where(filters)
      .orderBy('createdAt', 'desc');

    return tasks;
  }

  async findById(id: number): Promise<Task> {
    const task = await this.model.query().findById(id).withGraphJoined(this.relations);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }

  async create(taskCreateData: TaskCreateData): Promise<Task> {
    const { labelIds = [], ...taskFields } = taskCreateData;
    const transaction = await this.model.startTransaction();

    try {
      const createdTask = await this.model.query(transaction).insertAndFetch(taskFields);

      if (labelIds.length > 0) {
        await Promise.all(
          labelIds.map((labelId) => (
            createdTask.$relatedQuery('labels', transaction).relate(labelId)
          )),
        );
      }

      await transaction.commit();

      return createdTask;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }

  async update(taskUpdateData: TaskUpdateData): Promise<Task> {
    const { id, labelIds = [], ...taskFields } = taskUpdateData;
    const task = await this.findById(id);
    const transaction = await this.model.startTransaction();

    try {
      const updatedTask = await task.$query(transaction).patchAndFetch(taskFields);

      await TaskLabel.query(transaction).delete().where('taskId', task.id);

      if (labelIds.length > 0) {
        await Promise.all(
          labelIds.map((labelId) => (
            updatedTask.$relatedQuery('labels', transaction).relate(labelId)
          )),
        );
      }

      await transaction.commit();

      return updatedTask;
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  }
}

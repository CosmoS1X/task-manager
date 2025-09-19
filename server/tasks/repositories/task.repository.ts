import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { Task } from '../entities/task.entity';
import { TaskFilterDto } from '../dto/task-filter.dto';

@Injectable()
export class TaskRepository extends BaseRepository<Task> {
  protected model = Task;

  private readonly relations = '[status, creator, executor, labels]';

  // eslint-disable-next-line class-methods-use-this
  private createFilters(taskFilterDto: TaskFilterDto, userId?: number) {
    return {
      ...taskFilterDto.status && { statusId: taskFilterDto.status },
      ...taskFilterDto.executor && { executorId: taskFilterDto.executor },
      ...taskFilterDto.label && { labelId: taskFilterDto.label },
      ...taskFilterDto.isCreator && userId && { creatorId: userId },
    };
  }

  async findAll(taskFilterDto?: TaskFilterDto, userId?: number): Promise<Task[]> {
    const filters = taskFilterDto ? this.createFilters(taskFilterDto, userId) : {};

    const tasks = await this.model.query()
      .withGraphJoined(this.relations)
      .where(filters)
      .orderBy('createdAt', 'desc');

    return tasks;
  }

  async findById(id: number): Promise<Task> {
    const task = await this.model.query()
      .findById(id)
      .withGraphJoined(this.relations);

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return task;
  }
}

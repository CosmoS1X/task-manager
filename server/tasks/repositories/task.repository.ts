import { Injectable, NotFoundException } from '@nestjs/common';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { Task } from '../entities/task.entity';

@Injectable()
export class TaskRepository extends BaseRepository<Task> {
  protected model = Task;

  private readonly relations = '[status, creator, executor, labels]';

  async findAll(): Promise<Task[]> {
    const tasks = await this.model.query()
      .withGraphJoined(this.relations)
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

import { Injectable, Logger } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TaskRepository } from './repositories/task.repository';
import type { TaskFilterData, TaskCreateData, TaskUpdateData } from './repositories/task.repository';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async findAll(taskFilterData: TaskFilterData): Promise<Task[]> {
    this.logger.log('Fetching all tasks...');

    const tasks = await this.taskRepository.findAll(taskFilterData);

    this.logger.log(`Found ${tasks.length} tasks`);

    return tasks;
  }

  async findById(id: number): Promise<Task> {
    this.logger.log(`Fetching task with ID: ${id}...`);

    return this.taskRepository.findById(id);
  }

  async create(taskCreateData: TaskCreateData): Promise<Task> {
    this.logger.log('Creating a new task...');

    const newTask = await this.taskRepository.create(taskCreateData);

    this.logger.log(`Successfully created task with ID: ${newTask.id}`);

    return newTask;
  }

  async update(taskUpdateData: TaskUpdateData): Promise<Task> {
    this.logger.log(`Updating task with ID: ${taskUpdateData.id}...`);

    const updatedTask = await this.taskRepository.update(taskUpdateData);

    this.logger.log(`Successfully updated task with ID: ${taskUpdateData.id}`);

    return updatedTask;
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Attempting to delete task with ID: ${id}...`);

    await this.taskRepository.delete(id);

    this.logger.log(`Successfully deleted task with ID: ${id}`);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TaskRepository } from './repositories/task.repository';
import { TaskFilterDto } from './dto/task-filter.dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(private readonly taskRepository: TaskRepository) {}

  async findAll(taskFilterDto: TaskFilterDto, userId: number): Promise<Task[]> {
    this.logger.log('Fetching all tasks...');

    const tasks = await this.taskRepository.findAll(taskFilterDto, userId);

    this.logger.log(`Found ${tasks.length} tasks`);

    return tasks;
  }

  async findById(id: number): Promise<Task> {
    this.logger.log(`Fetching task with ID: ${id}...`);

    return this.taskRepository.findById(id);
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Task } from './entities/task.entity';
import { TaskRepository } from './repositories/task.repository';
import { TaskFilterDto } from './dto/task-filter.dto';
import { CreateTaskDto } from './dto/create-task.dto';

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

  async create(taskData: CreateTaskDto & { creatorId: number }): Promise<Task> {
    this.logger.log('Creating a new task...');

    const newTask = await this.taskRepository.create(taskData);

    this.logger.log(`Successfully created task with ID: ${newTask.id}`);

    return newTask;
  }
}

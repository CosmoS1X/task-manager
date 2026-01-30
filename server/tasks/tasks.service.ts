import { Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Task } from './entities/task.entity';
import { TaskLabel } from './entities/task-label.entity';
import { TaskRepository, TaskFilterData, TaskCreateData } from './repositories/task.repository';
import { UpdateTaskDto } from './dto';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(
    private readonly taskRepository: TaskRepository,
    private readonly dataSource: DataSource,
  ) {}

  async findAll(taskFilterData: TaskFilterData): Promise<Task[]> {
    this.logger.log('Fetching all tasks...');

    const tasks = await this.taskRepository.findAllWithFilters(taskFilterData);

    this.logger.log(`Found ${tasks.length} tasks`);

    return tasks;
  }

  async findById(id: number): Promise<Task> {
    this.logger.log(`Fetching task with ID: ${id}...`);

    const task = await this.taskRepository.findById(id, {
      relations: {
        status: true,
        creator: true,
        executor: true,
        taskLabels: {
          label: true,
          task: false,
        },
      },
    });

    this.logger.log(`Found task with ID: ${id}`);

    return task;
  }

  async create(taskCreateData: TaskCreateData): Promise<Task> {
    this.logger.log('Creating a new task...');

    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const taskRepository = queryRunner.manager.getRepository(Task);
      const taskLabelRepository = queryRunner.manager.getRepository(TaskLabel);

      const newTask = await taskRepository.save(taskCreateData);

      if (taskCreateData.labelIds && taskCreateData.labelIds.length > 0) {
        const labelRelations = taskCreateData.labelIds.map((labelId) => ({
          taskId: newTask.id,
          labelId,
        }));

        await taskLabelRepository.insert(labelRelations);
      }

      await queryRunner.commitTransaction();

      this.logger.log(`Successfully created task with ID: ${newTask.id}`);

      return newTask;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(`Failed to create task: ${error}`);

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    this.logger.log(`Updating task with ID: ${id}...`);

    const { labelIds, ...restData } = updateTaskDto;
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const taskRepository = queryRunner.manager.getRepository(Task);
      const taskLabelRepository = queryRunner.manager.getRepository(TaskLabel);

      await taskRepository.update(id, restData);
      await taskLabelRepository.delete({ taskId: id });

      if (labelIds && labelIds.length > 0) {
        const labelRelations = labelIds.map((labelId) => ({
          taskId: id,
          labelId,
        }));

        await taskLabelRepository.insert(labelRelations);
      }

      const updatedTask = await taskRepository.findOne({ where: { id } });

      await queryRunner.commitTransaction();

      this.logger.log(`Successfully updated task with ID: ${id}`);

      return updatedTask as Task;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      this.logger.error(`Failed to update task: ${error}`);

      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Attempting to delete task with ID: ${id}...`);

    await this.taskRepository.deleteById(id);

    this.logger.log(`Successfully deleted task with ID: ${id}`);
  }
}

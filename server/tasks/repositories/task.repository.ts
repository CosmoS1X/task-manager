import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { Task } from '../entities/task.entity';
import { TaskFilterDto, CreateTaskDto } from '../dto';

export interface TaskFilterData extends TaskFilterDto {
  creatorId: number;
}

export interface TaskCreateData extends CreateTaskDto {
  creatorId: number;
}

@Injectable()
export class TaskRepository extends BaseRepository<Task> {
  constructor(dataSource: DataSource) {
    super(Task, dataSource.createEntityManager());
  }

  async findAllWithFilters(taskFilterData: TaskFilterData): Promise<Task[]> {
    const { status, executor, label, isCreator, creatorId } = taskFilterData;

    const query = this.createQueryBuilder('task')
      .leftJoinAndSelect('task.status', 'status')
      .leftJoinAndSelect('task.creator', 'creator')
      .leftJoinAndSelect('task.executor', 'executor')
      .leftJoinAndSelect('task.taskLabels', 'taskLabel')
      .leftJoinAndSelect('taskLabel.label', 'label')
      .orderBy('task.createdAt', 'DESC');

    if (status) {
      query.andWhere('task.statusId = :status', { status });
    }

    if (executor) {
      query.andWhere('task.executorId = :executor', { executor });
    }

    if (label) {
      query.andWhere('label.id = :label', { label });
    }

    if (isCreator) {
      query.andWhere('task.creatorId = :creatorId', { creatorId });
    }

    return query.getMany();
  }
}

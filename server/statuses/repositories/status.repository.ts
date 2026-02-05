import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { Status } from '../entities/status.entity';

@Injectable()
export class StatusRepository extends BaseRepository<Status> {
  constructor(dataSource: DataSource) {
    super(Status, dataSource.createEntityManager());
  }

  async findByName(name: string): Promise<Status | null> {
    return this.findOneBy({ name });
  }
}

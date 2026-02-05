import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { Label } from '../entities/label.entity';

@Injectable()
export class LabelRepository extends BaseRepository<Label> {
  constructor(dataSource: DataSource) {
    super(Label, dataSource.createEntityManager());
  }

  async findByName(name: string): Promise<Label | null> {
    return this.findOneBy({ name });
  }
}

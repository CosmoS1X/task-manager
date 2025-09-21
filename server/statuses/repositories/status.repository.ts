import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { Status } from '../entities/status.entity';
import { CreateStatusDto } from '../dto/create-status.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

@Injectable()
export class StatusRepository extends BaseRepository<Status> {
  protected model = Status;

  async create(createStatusDto: CreateStatusDto): Promise<Status> {
    return this.model.query().insertAndFetch(createStatusDto);
  }

  async update(id: number, updateStatusDto: UpdateStatusDto): Promise<Status> {
    const status = await this.findById(id);

    return status.$query().patchAndFetch(updateStatusDto);
  }
}

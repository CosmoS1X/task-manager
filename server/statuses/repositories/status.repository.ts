import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { Status } from '../entities/status.entity';
import { CreateStatusDto } from '../dto/create-status.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

export interface StatusCreateData extends CreateStatusDto {}

export interface StatusUpdateData extends UpdateStatusDto {
  id: number;
}

@Injectable()
export class StatusRepository extends BaseRepository<Status> {
  protected model = Status;

  async create(statusCreateData: StatusCreateData): Promise<Status> {
    return this.model.query().insertAndFetch(statusCreateData);
  }

  async update(statusUpdateData: StatusUpdateData): Promise<Status> {
    const { id, ...statusFields } = statusUpdateData;
    const status = await this.findById(id);

    return status.$query().patchAndFetch(statusFields);
  }
}

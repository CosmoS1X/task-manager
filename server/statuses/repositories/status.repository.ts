import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { Status } from '../entities/status.entity';
import { CreateStatusDto } from '../dto/create-status.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

@Injectable()
export class StatusRepository extends BaseRepository<Status> {
  protected model = Status;

  async create(createStatusDto: CreateStatusDto): Promise<Status> {
    const status = new Status();

    status.name = createStatusDto.name;

    return this.model.query().insert(status);
  }

  async update(id: number, updateStatusDto: UpdateStatusDto): Promise<Status> {
    const status = await this.findById(id);

    if (updateStatusDto.name) {
      status.name = updateStatusDto.name;
    }

    return status.$query().patchAndFetch(status);
  }
}

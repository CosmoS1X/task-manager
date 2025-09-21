import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { Label } from '../entities/label.entity';
import { CreateLabelDto } from '../dto/create-label.dto';
import { UpdateLabelDto } from '../dto/update-label.dto';

@Injectable()
export class LabelRepository extends BaseRepository<Label> {
  protected model = Label;

  async create(createLabelDto: CreateLabelDto): Promise<Label> {
    return this.model.query().insertAndFetch(createLabelDto);
  }

  async update(id: number, updateLabelDto: UpdateLabelDto): Promise<Label> {
    const label = await this.findById(id);

    return label.$query().patchAndFetch(updateLabelDto);
  }
}

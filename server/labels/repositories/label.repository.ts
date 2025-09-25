import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { Label } from '../entities/label.entity';
import { CreateLabelDto } from '../dto/create-label.dto';
import { UpdateLabelDto } from '../dto/update-label.dto';

export interface LabelCreateData extends CreateLabelDto {}

export interface LabelUpdateData extends UpdateLabelDto {
  id: number;
}

@Injectable()
export class LabelRepository extends BaseRepository<Label> {
  protected model = Label;

  async create(labelCreateData: LabelCreateData): Promise<Label> {
    return this.model.query().insertAndFetch(labelCreateData);
  }

  async update(labelUpdateData: LabelUpdateData): Promise<Label> {
    const { id, ...labelFields } = labelUpdateData;
    const label = await this.findById(id);

    return label.$query().patchAndFetch(labelFields);
  }
}

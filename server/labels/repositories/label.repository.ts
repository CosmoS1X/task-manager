import { Injectable } from '@nestjs/common';
import { BaseRepository } from '@server/common/repositories/base.repository';
import { Label } from '../entities/label.entity';
import { CreateLabelDto } from '../dto/create-label.dto';
import { UpdateLabelDto } from '../dto/update-label.dto';

@Injectable()
export class LabelRepository extends BaseRepository<Label> {
  protected model = Label;

  async create(createLabelDto: CreateLabelDto): Promise<Label> {
    const label = new Label();

    label.name = createLabelDto.name;

    return this.model.query().insert(label);
  }

  async update(id: number, updateLabelDto: UpdateLabelDto): Promise<Label> {
    const label = await this.findById(id);

    if (updateLabelDto.name) {
      label.name = updateLabelDto.name;
    }

    return label.$query().patchAndFetch(label);
  }
}

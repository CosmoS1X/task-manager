import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { Label } from './entities/label.entity';
import { LabelRepository } from './repositories/label.repository';
import { CreateLabelDto, UpdateLabelDto } from './dto';

@Injectable()
export class LabelsService {
  private readonly logger = new Logger(LabelsService.name);

  constructor(private readonly labelRepository: LabelRepository) {}

  async findAll(): Promise<Label[]> {
    this.logger.log('Fetching all labels...');

    const labels = await this.labelRepository.findAll();

    this.logger.log(`Found ${labels.length} labels`);

    return labels;
  }

  async findById(id: number): Promise<Label> {
    this.logger.log(`Fetching label with ID: ${id}...`);

    return this.labelRepository.findById(id);
  }

  async create(createLabelDto: CreateLabelDto): Promise<Label> {
    this.logger.log('Creating new label...');

    const existingLabel = await this.labelRepository.findByName(createLabelDto.name);

    if (existingLabel) {
      this.logger.warn(`Label ${createLabelDto.name} already exists`);

      throw new ConflictException('Label with this name already exists');
    }

    const newLabel = await this.labelRepository.save(createLabelDto);

    this.logger.log(`Successfully created label with ID: ${newLabel.id}`);

    return newLabel;
  }

  async update(id: number, updateLabelDto: UpdateLabelDto): Promise<Label> {
    this.logger.log(`Updating label with ID: ${id}...`);

    const label = await this.labelRepository.findById(id);

    if (updateLabelDto.name && updateLabelDto.name !== label.name) {
      const existingLabel = await this.labelRepository.findByName(updateLabelDto.name);

      if (existingLabel) {
        this.logger.warn(`Label ${updateLabelDto.name} already exists`);

        throw new ConflictException('Label with this name already exists');
      }
    }

    const updatedLabel = await this.labelRepository.patchAndFetch(id, updateLabelDto);

    this.logger.log(`Successfully updated label with ID: ${id}`);

    return updatedLabel;
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Attempting to delete label with ID: ${id}...`);

    await this.labelRepository.deleteById(id);

    this.logger.log(`Successfully deleted label with ID: ${id}`);
  }
}

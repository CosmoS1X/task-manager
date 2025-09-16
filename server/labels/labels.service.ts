import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Label } from './entities/label.entity';
import { LabelRepository } from './repositories/label.repository';
import { CreateLabelDto } from './dto/create-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';

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

    const newLabel = await this.labelRepository.create(createLabelDto);

    this.logger.log(`Successfully created label with ID: ${newLabel.id}`);

    return newLabel;
  }

  async update(id: number, updateLabelDto: UpdateLabelDto): Promise<Label> {
    this.logger.log(`Updating label with ID: ${id}...`);

    const updatedLabel = await this.labelRepository.update(id, updateLabelDto);

    if (!updatedLabel) {
      this.logger.error(`Failed to update label with ID: ${id}`);

      throw new NotFoundException(`Label with ID ${id} not found`);
    }

    this.logger.log(`Successfully updated label with ID: ${id}`);

    return updatedLabel;
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Attempting to delete label with ID: ${id}...`);

    const deletedCount = await this.labelRepository.delete(id);
    const isDeleted = deletedCount === 1;

    if (!isDeleted) {
      this.logger.error(`Failed to delete label with ID: ${id}`);

      throw new NotFoundException(`Label with ID ${id} not found or already deleted`);
    }

    this.logger.log(`Successfully deleted label with ID: ${id}`);
  }
}

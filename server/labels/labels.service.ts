import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Label } from './entities/label.entity';
import { LabelRepository, LabelCreateData, LabelUpdateData } from './repositories/label.repository';

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

  async create(labelCreateData: LabelCreateData): Promise<Label> {
    this.logger.log('Creating new label...');

    const newLabel = await this.labelRepository.create(labelCreateData);

    this.logger.log(`Successfully created label with ID: ${newLabel.id}`);

    return newLabel;
  }

  async update(labelUpdateData: LabelUpdateData): Promise<Label> {
    this.logger.log(`Updating label with ID: ${labelUpdateData.id}...`);

    const updatedLabel = await this.labelRepository.update(labelUpdateData);

    this.logger.log(`Successfully updated label with ID: ${labelUpdateData.id}`);

    return updatedLabel;
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Attempting to delete label with ID: ${id}...`);

    const deletedRows = await this.labelRepository.delete(id);

    if (deletedRows === 0) {
      this.logger.error(`Failed to delete label with ID: ${id}`);

      throw new NotFoundException(`Label with ID ${id} not found or already deleted`);
    }

    this.logger.log(`Successfully deleted label with ID: ${id}`);
  }
}

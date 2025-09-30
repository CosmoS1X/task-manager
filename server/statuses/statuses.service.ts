import { Injectable, Logger } from '@nestjs/common';
import { Status } from './entities/status.entity';
import { StatusRepository, StatusCreateData, StatusUpdateData } from './repositories/status.repository';

@Injectable()
export class StatusesService {
  private readonly logger = new Logger(StatusesService.name);

  constructor(private readonly statusRepository: StatusRepository) {}

  async findAll(): Promise<Status[]> {
    this.logger.log('Fetching all statuses...');

    const statuses = await this.statusRepository.findAll();

    this.logger.log(`Found ${statuses.length} statuses`);

    return statuses;
  }

  async findById(id: number): Promise<Status> {
    this.logger.log(`Fetching status with ID: ${id}...`);

    return this.statusRepository.findById(id);
  }

  async create(statusCreateData: StatusCreateData): Promise<Status> {
    this.logger.log('Creating new status...');

    const newStatus = await this.statusRepository.create(statusCreateData);

    this.logger.log(`Successfully created status with ID: ${newStatus.id}`);

    return newStatus;
  }

  async update(statusUpdateData: StatusUpdateData): Promise<Status> {
    this.logger.log(`Updating status with ID: ${statusUpdateData.id}...`);

    const updatedStatus = await this.statusRepository.update(statusUpdateData);

    this.logger.log(`Successfully updated status with ID: ${statusUpdateData.id}`);

    return updatedStatus;
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Attempting to delete status with ID: ${id}...`);

    await this.statusRepository.delete(id);

    this.logger.log(`Successfully deleted status with ID: ${id}`);
  }
}

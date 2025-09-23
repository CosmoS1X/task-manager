import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Status } from './entities/status.entity';
import { StatusRepository } from './repositories/status.repository';
import { CreateStatusDto } from './dto/create-status.dto';
import { UpdateStatusDto } from './dto/update-status.dto';

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

  async create(createStatusDto: CreateStatusDto): Promise<Status> {
    this.logger.log('Creating new status...');

    const newStatus = await this.statusRepository.create(createStatusDto);

    this.logger.log(`Successfully created status with ID: ${newStatus.id}`);

    return newStatus;
  }

  async update(id: number, updateStatusDto: UpdateStatusDto): Promise<Status> {
    this.logger.log(`Updating status with ID: ${id}...`);

    const updatedStatus = await this.statusRepository.update(id, updateStatusDto);

    if (!updatedStatus) {
      this.logger.error(`Failed to update status with ID: ${id}`);

      throw new NotFoundException(`Status with ID ${id} not found`);
    }

    this.logger.log(`Successfully updated status with ID: ${id}`);

    return updatedStatus;
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Attempting to delete status with ID: ${id}...`);

    const deletedRows = await this.statusRepository.delete(id);

    if (deletedRows === 0) {
      this.logger.error(`Failed to delete status with ID: ${id}`);

      throw new NotFoundException(`Status with ID ${id} not found or already deleted`);
    }

    this.logger.log(`Successfully deleted status with ID: ${id}`);
  }
}

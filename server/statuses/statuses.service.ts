import { Injectable, Logger, ConflictException } from '@nestjs/common';
import { Status } from './entities/status.entity';
import { StatusRepository } from './repositories/status.repository';
import { CreateStatusDto, UpdateStatusDto } from './dto';

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

    const existingStatus = await this.statusRepository.findByName(createStatusDto.name);

    if (existingStatus) {
      this.logger.warn(`Status ${createStatusDto.name} already exists`);

      throw new ConflictException('Status with this name already exists');
    }

    const newStatus = await this.statusRepository.save(createStatusDto);

    this.logger.log(`Successfully created status with ID: ${newStatus.id}`);

    return newStatus;
  }

  async update(id: number, updateStatusDto: UpdateStatusDto): Promise<Status> {
    this.logger.log(`Updating status with ID: ${id}...`);

    const status = await this.statusRepository.findById(id);

    if (updateStatusDto.name && updateStatusDto.name !== status.name) {
      const existingStatus = await this.statusRepository.findByName(updateStatusDto.name);

      if (existingStatus) {
        this.logger.warn(`Status ${updateStatusDto.name} already exists`);

        throw new ConflictException('Status with this name already exists');
      }
    }

    const updatedStatus = await this.statusRepository.patchAndFetch(id, updateStatusDto);

    this.logger.log(`Successfully updated status with ID: ${id}`);

    return updatedStatus;
  }

  async delete(id: number): Promise<void> {
    this.logger.log(`Attempting to delete status with ID: ${id}...`);

    await this.statusRepository.deleteById(id);

    this.logger.log(`Successfully deleted status with ID: ${id}`);
  }
}

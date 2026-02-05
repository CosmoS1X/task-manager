import {
  Repository,
  ObjectLiteral,
  UpdateResult,
  DeleteResult,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
} from 'typeorm';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseRepository<T extends ObjectLiteral> extends Repository<T> {
  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.find(options);
  }

  async findById(id: number, options?: FindOneOptions<T>): Promise<T> {
    const entity = await this.findOne({
      where: { id } as unknown as FindOptionsWhere<T>,
      ...options,
    });

    if (!entity) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return entity;
  }

  async patchAndFetch(id: number, partialEntity: Partial<T>): Promise<T> {
    const result: UpdateResult = await this.update(id, partialEntity);

    /* istanbul ignore if */
    if (result.affected === 0) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return this.findById(id);
  }

  async deleteById(id: number): Promise<void> {
    const result: DeleteResult = await this.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Resource with ID ${id} not found or already deleted`);
    }
  }
}

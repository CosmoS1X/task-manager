import { Model, ModelClass } from 'objection';
import { NotFoundException } from '@nestjs/common';

export abstract class BaseRepository<T extends Model> {
  protected abstract model: ModelClass<T>;

  async findAll(): Promise<T[]> {
    const result = await this.model.query();

    return result as T[];
  }

  async findById(id: number): Promise<T> {
    const result = await this.model.query().findById(id);

    if (!result) {
      throw new NotFoundException(`Resource with ID ${id} not found`);
    }

    return result as T;
  }

  async delete(id: number): Promise<number> { // returns number of rows deleted
    const result = await this.model.query().deleteById(id);

    if (result === 0) {
      throw new NotFoundException(`Resource with ID ${id} not found or already deleted`);
    }

    return result;
  }
}

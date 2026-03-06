import { NotFoundException } from '@nestjs/common';
import { BaseRepository } from './base.repository';

export abstract class BaseService<T extends { id: number }> {
  constructor(protected readonly repository: BaseRepository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.findAll();
  }

  async findByIdOrThrow(id: number): Promise<T> {
    const entity = await this.repository.findById(id);
    if (!entity) {
      throw new NotFoundException('Resource not found');
    }
    return entity;
  }
}

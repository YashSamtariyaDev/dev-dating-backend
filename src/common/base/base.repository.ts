import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';

export abstract class BaseRepository<T extends { id: number }> {
  constructor(protected readonly repository: Repository<T>) {}

  findAll(): Promise<T[]> {
    return this.repository.find();
  }

  findById(id: number): Promise<T | null> {
    return this.repository.findOne({ where: { id } as FindOptionsWhere<T> });
  }

  create(data: DeepPartial<T>): T {
    return this.repository.create(data);
  }

  save(entity: T): Promise<T> {
    return this.repository.save(entity);
  }

  deleteById(id: number) {
    return this.repository.delete(id);
  }
}

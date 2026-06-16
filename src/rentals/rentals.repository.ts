import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Rental } from './entities/rental.entity';

@Injectable()
export class RentalsRepository {
  constructor(
    @InjectRepository(Rental)
    private readonly repo: Repository<Rental>,
  ) {}

  create(data: Partial<Rental>): Promise<Rental> {
    const rental = this.repo.create(data);
    return this.repo.save(rental);
  }

  findAll(): Promise<Rental[]> {
    return this.repo.find({
      relations: ['customer'],
      order: { createdAt: 'DESC' },
    });
  }

  findById(id: string): Promise<Rental | null> {
    return this.repo.findOne({ where: { id }, relations: ['customer'] });
  }

  async update(id: string, data: Partial<Rental>): Promise<void> {
    await this.repo.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

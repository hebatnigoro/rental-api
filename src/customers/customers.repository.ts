import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersRepository {
  constructor(
    @InjectRepository(Customer)
    private readonly repo: Repository<Customer>,
  ) {}

  create(data: Partial<Customer>): Promise<Customer> {
    const customer = this.repo.create(data);
    return this.repo.save(customer);
  }

  findAll(): Promise<Customer[]> {
    return this.repo.find({ order: { createdAt: 'DESC' } });
  }

  findById(id: string): Promise<Customer | null> {
    return this.repo.findOne({ where: { id }, relations: ['rentals'] });
  }

  async update(id: string, data: Partial<Customer>): Promise<void> {
    await this.repo.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}

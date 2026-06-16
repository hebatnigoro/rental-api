import { Injectable, NotFoundException } from '@nestjs/common';
import { CustomersRepository } from './customers.repository';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { Customer } from './entities/customer.entity';

@Injectable()
export class CustomersService {
  constructor(private readonly customersRepository: CustomersRepository) {}

  create(dto: CreateCustomerDto): Promise<Customer> {
    return this.customersRepository.create(dto);
  }

  findAll(): Promise<Customer[]> {
    return this.customersRepository.findAll();
  }

  async findOne(id: string): Promise<Customer> {
    const customer = await this.customersRepository.findById(id);
    if (!customer) {
      throw new NotFoundException(`Customer dengan id ${id} tidak ditemukan`);
    }
    return customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    await this.findOne(id); // pastikan ada dulu
    await this.customersRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.customersRepository.remove(id);
    return { message: 'Customer berhasil dihapus' };
  }
}

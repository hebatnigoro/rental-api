import { Injectable, NotFoundException } from '@nestjs/common';
import { RentalsRepository } from './rentals.repository';
import { CustomersService } from '../customers/customers.service';
import { CreateRentalDto } from './dto/create-rental.dto';
import { UpdateRentalDto } from './dto/update-rental.dto';
import { Rental } from './entities/rental.entity';

@Injectable()
export class RentalsService {
  constructor(
    private readonly rentalsRepository: RentalsRepository,
    private readonly customersService: CustomersService,
  ) {}

  async create(dto: CreateRentalDto): Promise<Rental> {
    // pastikan customer-nya benar-benar ada sebelum buat rental
    await this.customersService.findOne(dto.customerId);
    return this.rentalsRepository.create(dto);
  }

  findAll(): Promise<Rental[]> {
    return this.rentalsRepository.findAll();
  }

  async findOne(id: string): Promise<Rental> {
    const rental = await this.rentalsRepository.findById(id);
    if (!rental) {
      throw new NotFoundException(`Rental dengan id ${id} tidak ditemukan`);
    }
    return rental;
  }

  async update(id: string, dto: UpdateRentalDto): Promise<Rental> {
    await this.findOne(id);
    if (dto.customerId) {
      await this.customersService.findOne(dto.customerId);
    }
    await this.rentalsRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: string): Promise<{ message: string }> {
    await this.findOne(id);
    await this.rentalsRepository.remove(id);
    return { message: 'Data rental berhasil dihapus' };
  }
}

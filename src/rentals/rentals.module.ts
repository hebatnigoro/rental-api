import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Rental } from './entities/rental.entity';
import { RentalsService } from './rentals.service';
import { RentalsController } from './rentals.controller';
import { RentalsRepository } from './rentals.repository';
import { CustomersModule } from '../customers/customers.module';

@Module({
  imports: [TypeOrmModule.forFeature([Rental]), CustomersModule],
  controllers: [RentalsController],
  providers: [RentalsService, RentalsRepository],
})
export class RentalsModule {}

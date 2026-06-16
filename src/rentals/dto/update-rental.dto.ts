import { PartialType } from '@nestjs/mapped-types';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateRentalDto } from './create-rental.dto';
import { RentalStatus } from '../entities/rental.entity';

export class UpdateRentalDto extends PartialType(CreateRentalDto) {
  @IsEnum(RentalStatus, { message: 'status harus ongoing atau returned' })
  @IsOptional()
  status?: RentalStatus;
}

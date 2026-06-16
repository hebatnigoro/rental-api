import {
  IsDateString,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateRentalDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama barang wajib diisi' })
  itemName: string;

  @IsInt()
  @Min(1, { message: 'Jumlah minimal 1' })
  @IsOptional()
  quantity?: number;

  @IsDateString({}, { message: 'startDate harus format tanggal (YYYY-MM-DD)' })
  startDate: string;

  @IsDateString({}, { message: 'endDate harus format tanggal (YYYY-MM-DD)' })
  endDate: string;

  @IsUUID('4', { message: 'customerId tidak valid' })
  customerId: string;
}

import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsString()
  @IsNotEmpty({ message: 'Nama customer wajib diisi' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'Nomor telepon wajib diisi' })
  phone: string;

  @IsString()
  @IsOptional()
  address?: string;
}

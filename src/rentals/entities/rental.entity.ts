import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Customer } from '../../customers/entities/customer.entity';

export enum RentalStatus {
  ONGOING = 'ongoing',
  RETURNED = 'returned',
}

@Entity('rentals')
export class Rental {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemName: string;

  @Column({ type: 'int', default: 1 })
  quantity: number;

  @Column({ type: 'date' })
  startDate: string;

  @Column({ type: 'date' })
  endDate: string;

  @Column({
    type: 'enum',
    enum: RentalStatus,
    default: RentalStatus.ONGOING,
  })
  status: RentalStatus;

  // relasi: banyak rental dimiliki oleh satu customer
  @ManyToOne(() => Customer, (customer) => customer.rentals, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'customerId' })
  customer: Customer;

  @Column()
  customerId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

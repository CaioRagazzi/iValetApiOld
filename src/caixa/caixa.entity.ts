import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsDate, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../transaction/transaction.entity';
import { Company } from '../company/company.entity';

@Entity()
export class Caixa {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Column()
  openDate: Date;

  @ApiProperty()
  @IsDate()
  @Column({ nullable: true })
  closeDate: Date;

  @OneToMany(
    () => Transaction,
    transaction => transaction.company,
  )
  transaction: Transaction[];

  @ManyToOne(
    () => Company,
    company => company.caixa,
    { nullable: false },
  )
  company: Company;
}

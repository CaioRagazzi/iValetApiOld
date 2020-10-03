import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from 'src/company/company.entity';

@Entity()
@Unique('UQ_NAMES', ['company', 'placa'])
export class Transaction {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ length: 100 })
  placa: string;

  @ManyToOne(
    type => Company,
    company => company.transaction,
    { nullable: false },
  )
  @JoinColumn()
  company: Company;
}

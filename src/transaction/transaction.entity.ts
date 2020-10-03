import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from 'src/company/company.entity';

@Entity()
export class Transaction {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ length: 100 })
  placa: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsDate()
  @Column()
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @Column({ nullable: true })
  endDate: Date;

  @ManyToOne(
    type => Company,
    company => company.transaction,
    { nullable: false },
  )
  @JoinColumn()
  company: Company;
}

import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../company/company.entity';
import { Caixa } from '../caixa/caixa.entity';

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
  @IsNumber()
  @Column({ nullable: true })
  prisma: number;

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
    { nullable: false, eager: true },
  )
  @JoinColumn()
  company: Company;

  @ManyToOne(
    type => Caixa,
    caixa => caixa.transaction,
    { nullable: false },
  )
  @JoinColumn()
  caixa: Caixa;
}

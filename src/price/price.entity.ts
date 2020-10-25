import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { IsDecimal, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../company/company.entity';

@Entity()
export class Price {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  @Column({ nullable: false })
  type: number;

  @ApiProperty()
  @IsNumber()
  @Column({ nullable: true })
  to: number;

  @ApiProperty()
  @IsNumber()
  @Column({ nullable: true })
  from: number;

  @ApiProperty()
  @IsString()
  @Column({ nullable: true })
  weekDay: string;

  @ApiProperty()
  @IsDecimal()
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  price: number;

  @ApiProperty()
  @IsDecimal()
  @Column('decimal', { precision: 5, scale: 2, nullable: true })
  maxPriceValue: number;

  @ManyToOne(
    type => Company,
    company => company.transaction,
    { nullable: false },
  )
  @JoinColumn()
  company: Company;

  @ApiProperty()
  @IsString()
  @Column({ nullable: false })
  uniqueIdPrice: string;

  @ApiProperty()
  @IsNumber()
  @Column({ default: 0 })
  gracePeriod: number;
}

import { Entity, PrimaryGeneratedColumn, ManyToOne, Column } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Company } from '../company/company.entity';
import { IsDecimal, IsNotEmpty, IsString } from 'class-validator';

@Entity()
export class MonthlyPrices {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Company,
    company => company.id,
    { nullable: false, eager: true },
  )
  company: Company;

  @ApiProperty()
  @IsNotEmpty()
  @Column("decimal", { precision: 5, scale: 2 })
  price: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ length: 500 })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ length: 500 })
  description: string;
}

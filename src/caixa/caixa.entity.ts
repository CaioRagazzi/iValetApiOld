import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/user.entity';
import { Transaction } from 'src/transaction/transaction.entity';
import { Company } from 'src/company/company.entity';

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

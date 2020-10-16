import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  OneToMany,
} from 'typeorm';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../transaction/transaction.entity';
import { Caixa } from '../caixa/caixa.entity';

@Entity()
@Unique('UQ_NAMES', ['name', 'user'])
export class Company {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ length: 500 })
  name: string;

  @IsNotEmpty()
  @IsInt()
  @ManyToOne(
    () => User,
    user => user.company,
  )
  user: User;

  @OneToMany(
    () => Transaction,
    transaction => transaction.company,
  )
  transaction: Transaction[];

  @OneToMany(
    () => Caixa,
    caixa => caixa.company,
  )
  caixa: Caixa[];
}

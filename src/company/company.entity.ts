import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  Unique,
  OneToMany,
} from 'typeorm';
import { IsDate, IsInt, IsNotEmpty, IsString } from 'class-validator';
import { User } from '../user/user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Transaction } from '../transaction/transaction.entity';
import { Caixa } from '../caixa/caixa.entity';
import { UserCompany } from 'src/userCompany/userCompany.entity';

@Entity()
// @Unique('UQ_NAMES', ['name', 'user'])
export class Company {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ length: 500 })
  name: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  updatedAt: Date;

  @OneToMany(
    () => UserCompany,
    userCompany => userCompany.company,
  )
  users: UserCompany[];

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

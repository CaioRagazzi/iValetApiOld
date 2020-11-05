import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';
import { MonthlyCustomer } from 'src/monthlyCustomer/monthlyCustomer.entity';
  
  @Entity()
  export class Customer {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty()
    @Column({ length: 100, nullable: true })
    placa: string;

    @ApiProperty()
    @Column({ length: 100, nullable: true })
    marca: string;

    @ApiProperty()
    @Column({ length: 100, nullable: true })
    modelo: string;

    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @OneToMany(() => MonthlyCustomer, monthlyCustomer => monthlyCustomer.customer)
    monthlyCustomer: MonthlyCustomer[];

  }
  
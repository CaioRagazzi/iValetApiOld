import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
    ManyToMany,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import { Company } from '../company/company.entity';
import { User } from 'src/user/user.entity';
import { Customer } from 'src/customer/customer.entity';
  
  @Entity()
  export class MonthlyCustomer {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(
      () => Company,
      company => company.id,
      { nullable: false },
    )
    company: Company;

    @ManyToOne(
      () => Customer,
      user => user.id,
    )
    customer: Customer;
  }
  
import {
    Entity,
    PrimaryGeneratedColumn,
    ManyToOne,
  } from 'typeorm';
  import { ApiProperty } from '@nestjs/swagger';
  import { Company } from '../company/company.entity';
import { Customer } from 'src/customer/customer.entity';
  
  @Entity()
  export class MonthlyCustomer {
    @ApiProperty()
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(
      () => Company,
      company => company.id,
      { nullable: false, eager:true },
    )
    company: Company;

    @ManyToOne(
      () => Customer,
      user => user.id,
      { eager: true }
    )
    customer: Customer;
  }
  
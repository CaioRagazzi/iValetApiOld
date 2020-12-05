import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  ManyToOne,
  OneToOne,
  JoinTable,
} from 'typeorm';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
} from 'class-validator';
import { Company } from '../company/company.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Perfil } from '../perfil/perfil.entity';
import { Customer } from '../customer/customer.entity';
import { UserCompany } from 'src/userCompany/userCompany.entity';

@Entity()
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ length: 500 })
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  @Column('varchar')
  password: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  @Column('varchar')
  @Index({ unique: true })
  email: string;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @ApiProperty()
  @IsDate()
  @IsNotEmpty()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(
    type => UserCompany,
    userCompany => userCompany.user,
  )
  companies: UserCompany[];

  @ManyToOne(
    type => Perfil,
    perfil => perfil.user,
    { nullable: false, eager: true },
  )
  @JoinTable()
  perfil: Perfil;
}

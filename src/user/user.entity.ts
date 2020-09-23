import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Company } from 'src/company/company.entity';
import { ApiProperty } from '@nestjs/swagger';

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
  @OneToMany(type => Company, company => company.user)
  company: Company[]
}
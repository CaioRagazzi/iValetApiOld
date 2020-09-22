import { Entity, Column, PrimaryGeneratedColumn, Index, OneToMany } from 'typeorm';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Company } from 'src/company/company.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @IsString()
  @Column({ length: 500 })
  name: string;

  @IsNotEmpty()
  @MinLength(6)
  @Column('varchar')
  password: string;

  @IsEmail()
  @IsNotEmpty()
  @Column('varchar')
  @Index({ unique: true })
  email: string;

  @OneToMany(type => Company, company => company.user)
  company: Company[]
}
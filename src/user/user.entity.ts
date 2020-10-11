import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  Index,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { IsDate, IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Company } from 'src/company/company.entity';
import { ApiProperty } from '@nestjs/swagger';
import { Perfil } from 'src/perfil/perfil.entity';
import { format } from "date-fns";

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
  @Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP"})
  createdOn: Date;

  @OneToMany(
    type => Company,
    company => company.user,
  )
  company: Company[];

  @ManyToOne(
    type => Perfil,
    perfil => perfil.user,
    { nullable: false },
  )
  perfil: Perfil;
}

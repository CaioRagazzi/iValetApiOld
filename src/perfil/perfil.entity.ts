import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';

@Entity()
export class Perfil {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  @Column({ length: 100 })
  name: string;

  @OneToMany(() => User, user => user.perfil)
  user: User;
}

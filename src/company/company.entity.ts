import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
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
    @ManyToOne(type => User, user => user.company)
    user: User;
}
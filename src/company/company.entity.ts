import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';
import { User } from 'src/user/user.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique("UQ_NAMES", ["name", "user"])
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
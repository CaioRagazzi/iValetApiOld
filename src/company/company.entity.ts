import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsInt, IsNotEmpty, isNumber, IsString } from 'class-validator';
import { User } from 'src/user/user.entity';

@Entity()
export class Company {
    @PrimaryGeneratedColumn()
    id: number;

    @IsNotEmpty()
    @IsString()
    @Column({ length: 500 })
    name: string;

    @IsNotEmpty()
    @IsInt()
    @ManyToOne(type => User, user => user.company)
    user: User;
}
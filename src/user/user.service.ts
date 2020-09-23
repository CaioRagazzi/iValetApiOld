import { Injectable, Inject } from '@nestjs/common';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { User } from './user.entity';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";
import { UserUpdateDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>,
    ) { }

    async findOneByEmail(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email: email } })
    }

    async findOneById(id: number): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { id: id } })
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async create(user: User): Promise<InsertResult> {
        user.password = this.hashPassword(user.password);
        return this.userRepository.insert(user);
    }

    async update(userId: number, user: UserUpdateDto): Promise<UpdateResult> {
        const userInst = new User();
        userInst.id = userId;
        userInst.email = user.email;
        userInst.name = user.name;

        const updatedUser = this.userRepository.update(userId, userInst)
        return updatedUser;
    }

    private hashPassword(password: string): string {
        const salt = genSaltSync(10);
        const hash = hashSync(password, salt);

        return hash;
    }

    comparePassword(password: string, hash: string): boolean {
        return compareSync(password, hash);
    }
}
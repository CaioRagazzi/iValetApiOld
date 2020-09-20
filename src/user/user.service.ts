import { Injectable, Inject } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { genSaltSync, hashSync, compareSync } from "bcryptjs";

@Injectable()
export class UserService {
    constructor(
        @Inject('USER_REPOSITORY')
        private userRepository: Repository<User>,
    ) { }

    async findOne(email: string): Promise<User | undefined> {
        return this.userRepository.findOne({ where: { email: email } })
    }

    async create(user: User): Promise<User> {
        user.password = this.hashPassword(user.password);
        return this.userRepository.save(user);
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
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "src/user/user.entity";
import { Repository } from "typeorm";
import { Customer } from "./customer.entity";

@Injectable()
export class CustomerService {
    constructor(
        @InjectRepository(Customer)
        private userRepository: Repository<Customer>,
      ) {}

    async addCustomer(user: User): Promise<void>{
        this.userRepository
        .createQueryBuilder()
        .insert()
        .values({
            user: user
        })
        .execute();
    }
}
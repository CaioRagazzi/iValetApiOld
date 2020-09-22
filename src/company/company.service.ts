import { Injectable, Inject } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompanyService {
    constructor(
        @Inject('COMPANY_REPOSITORY')
        private companyRepository: Repository<Company>,
        private userService: UserService
    ) { }

    async create(company: Company): Promise<Company>{
        return this.companyRepository.save(company);
    }
}
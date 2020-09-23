import { Injectable, Inject } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { InsertResult, Repository } from 'typeorm';
import { Company } from './company.entity';

@Injectable()
export class CompanyService {
    constructor(
        @Inject('COMPANY_REPOSITORY')
        private companyRepository: Repository<Company>,
        private userService: UserService
    ) { }

    async create(company: Company): Promise<InsertResult>{
        return this.companyRepository.insert(company);
    }
}
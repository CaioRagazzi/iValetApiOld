import { Injectable, Inject } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { InsertResult, Repository } from 'typeorm';
import { Company } from './company.entity';
import { CompanyInsertDto } from './dto/insert-company.dto';

@Injectable()
export class CompanyService {
    constructor(
        @Inject('COMPANY_REPOSITORY')
        private companyRepository: Repository<Company>,
        private userService: UserService
    ) { }

    async create(company: CompanyInsertDto): Promise<InsertResult> {
        const user = await this.userService.findOneById(company.user);

        const companyInst = new Company();
        companyInst.name = company.name;
        companyInst.user = user;

        return this.companyRepository.insert(companyInst);
    }
}
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'src/company/company.service';
import { Repository } from 'typeorm';
import { MonthlyCustomer } from './monthlyCustomer.entity';

@Injectable()
export class MonthlyCustomerService {
    constructor(
        @InjectRepository(MonthlyCustomer)
        private monthlyCustomerRepository: Repository<MonthlyCustomer>,
        private companyService: CompanyService
      ) {}


    async getByCompanyId(companyId: number): Promise<MonthlyCustomer[]>{
        const company = await this.companyService.findOneById(companyId);
        const monthlyCustomers = await this.monthlyCustomerRepository.find({ where: { company } })

        return monthlyCustomers;
    }

}
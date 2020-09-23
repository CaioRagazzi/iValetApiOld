import { Body, Controller, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { Company } from './company.entity';
import { CompanyService } from './company.service';

@Controller('company')
export class CompanyController {
    constructor(
        private companyService: CompanyService
    ) { }

    @Post()
    async create(@Body() company: Company): Promise<InsertResult> {
        try {
            const newCompany = this.companyService.create(company);
            return newCompany;
        } catch (error) {
            throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
        }
    }
}
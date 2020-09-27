import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { InsertResult } from 'typeorm';
import { CompanyService } from './company.service';
import { CompanyInsertDto } from './dto/insert-company.dto';

@Controller('company')
export class CompanyController {
    constructor(
        private companyService: CompanyService
    ) { }

    @Post()
    async create(@Body() company: CompanyInsertDto): Promise<InsertResult> {
        try {
            const newCompany = await this.companyService.create(company);
            return newCompany;
        } catch (error) {
            throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
        }
    }
}
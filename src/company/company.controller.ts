import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpService,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { ObjectLiteral } from 'typeorm';
import { CompanyService } from './company.service';
import { CompanyInsertDto } from './dto/insert-company.dto';

@Controller('company')
export class CompanyController {
  constructor(
    private companyService: CompanyService,
    private httpService: HttpService,
  ) {}

  @Post()
  async create(@Body() company: CompanyInsertDto): Promise<ObjectLiteral> {
    try {
      const newCompany = await this.companyService.create(company);
      return newCompany.identifiers[0];
    } catch (error) {
      throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':companyId')
  async getById(@Param('companyId') companyId: number): Promise<void> {
    let companyReturn;
    await this.httpService
      .get(`http://localhost:3002/company/${companyId}`)
      .toPromise()
      .then(response => {
        companyReturn = response.data;
      })
      .catch(error => {
        throw new HttpException(error.response.data, HttpStatus.BAD_REQUEST);
      });

    return companyReturn;
  }
}

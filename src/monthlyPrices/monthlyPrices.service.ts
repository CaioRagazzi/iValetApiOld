import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyService } from 'src/company/company.service';
import { InsertResult, Repository } from 'typeorm';
import { MonthlyPricesCreateDto } from './dto/monthly-prices-create.dto';
import { MonthlyPricesUpdateDto } from './dto/monthly-prices-update.dto';
import { MonthlyPrices } from './monthlyPrices.entity';

@Injectable()
export class MonthlyPricesService {
  constructor(
    @InjectRepository(MonthlyPrices)
    private monthlyPricesRepository: Repository<MonthlyPrices>,
    private companyService: CompanyService,
  ) {}

  async create(montlyPriceDto: MonthlyPricesCreateDto): Promise<InsertResult> {
    const company = await this.companyService.findOneById(montlyPriceDto.companyId);

    if (!company) {
        throw new Error('Company does not exists!');
    }

    const monthlyPrices = new MonthlyPrices();

    monthlyPrices.description = montlyPriceDto.description;
    monthlyPrices.name = montlyPriceDto.name;
    monthlyPrices.price = parseFloat(montlyPriceDto.price);
    monthlyPrices.company = company;

    const createdCompany = await this.monthlyPricesRepository.insert(monthlyPrices);

    return createdCompany;
  }

  async update(montlyPriceDto: MonthlyPricesUpdateDto, monthlyPricesId: number): Promise<MonthlyPrices> {

    const monthlyPriceReturn = await this.monthlyPricesRepository.findOne(monthlyPricesId);

    if (!monthlyPriceReturn) {
        throw new Error('Tabela de preço does not exists!');
    }

    if (montlyPriceDto.descricao) {
        monthlyPriceReturn.description = montlyPriceDto.descricao
    }

    if (montlyPriceDto.nome) {
        monthlyPriceReturn.name = montlyPriceDto.nome
    }

    if (montlyPriceDto.valor) {
        monthlyPriceReturn.price = parseFloat(montlyPriceDto.valor)
    }

    const updatedMonthlyPrice = await this.monthlyPricesRepository.save(monthlyPriceReturn);

    return updatedMonthlyPrice;
  }

  async get(companyId: number): Promise<MonthlyPrices[]>{
    const company = await this.companyService.findOneById(companyId);
    
    if (!company) {
      throw new Error(`Company with id ${companyId} does not exists!`);
    }

    const monthlyPrices = await this.monthlyPricesRepository.find({where: {company}});

    return monthlyPrices;
  }
}

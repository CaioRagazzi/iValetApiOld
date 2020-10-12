import { Injectable, Inject } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { InsertResult, ObjectLiteral, Repository } from 'typeorm';
import { InsertPriceDto } from './dto/insert-price.dto';
import { Price } from './price.entity';

@Injectable()
export class PriceService {
  constructor(
    @Inject('PRICE_REPOSITORY')
    private priceRepository: Repository<Price>,
    private companyService: CompanyService,
  ) {}

  async create(price: InsertPriceDto): Promise<ObjectLiteral> {
    if (
      price.type === 2 &&
      (price.to === undefined || price.from === undefined)
    ) {
      throw new Error('Type 2 requires to and from!');
    }

    const company = await this.companyService.findOneById(price.companyId);

    if (!company) {
      throw new Error('Company does not exists!');
    }

    const result = await this.priceRepository
      .createQueryBuilder()
      .insert()
      .values([
        {
          company,
          from: price.from,
          to: price.to,
          price: price.price,
          type: price.type,
          weekDay: price.weekDay,
          uniqueIdPrice: price.uniqueIdPrice
        },
      ])
      .execute();

    return result.generatedMaps;
  }

  async getById(priceId: number): Promise<Price> {
    const result = await this.priceRepository
      .createQueryBuilder()
      .where('id = :priceId', { priceId })
      .getOne();

    return result;
  }

  async getByWeekDayAndCompanyId(
    companyId: number,
    weekDay: string,
  ): Promise<Price> {
    const result = await this.priceRepository
      .createQueryBuilder()
      .where('companyId = :companyId', { companyId })
      .andWhere('weekDay = :weekDay', { weekDay })
      .getOne();

    return result;
  }
}

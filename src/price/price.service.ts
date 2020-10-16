import { Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { ObjectLiteral, Repository } from 'typeorm';
import { InsertPriceDto } from './dto/insert-price.dto';
import { Price } from './price.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PriceService {
  constructor(
    @InjectRepository(Price)
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

    const splitedWeekDay = price.weekDay.split('|');

    await this.checkIfSameDayHasAlreadyBeenInserted(
      splitedWeekDay,
      price.companyId,
      price.uniqueIdPrice,
    );

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
          uniqueIdPrice: price.uniqueIdPrice,
        },
      ])
      .execute();

    return result.generatedMaps;
  }

  async getPrices(companyId: number): Promise<Price[]> {
    const prices = await this.priceRepository
      .createQueryBuilder()
      .select(['weekDay', 'uniqueIdPrice', 'companyId', 'type'])
      .groupBy('uniqueIdPrice')
      .having('companyId = :companyId', { companyId })
      .getRawMany();

    return prices;
  }

  async getPriceByUniqueId(uniqueIdPrice: number): Promise<Price[]> {
    const prices = await this.priceRepository
      .createQueryBuilder()
      .where('uniqueIdPrice = :uniqueIdPrice', { uniqueIdPrice })
      .getMany();

    return prices;
  }

  private async checkIfSameDayHasAlreadyBeenInserted(
    splitedWeekDay: string[],
    companyId: number,
    uniqueIdPrice: string,
  ): Promise<void> {
    const prices = await this.priceRepository
      .createQueryBuilder()
      .select()
      .where('companyId = :companyId', { companyId })
      .getMany();

    prices.map(price => {
      const splitedReturn = price.weekDay.split('|');
      splitedReturn.map(day => {
        splitedWeekDay.map(dayParam => {
          if (day === dayParam && price.uniqueIdPrice !== uniqueIdPrice) {
            throw new Error('Same day has already been added!');
          }
        });
      });
    });
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

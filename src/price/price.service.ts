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

    const splitedWeekDay = price.weekDay.split('|');
    const hasSameDay = await this.checkIfSameDayHasAlreadyBeenInserted(
      splitedWeekDay,
      price.companyId,
      price.uniqueIdPrice,
    );

    if (hasSameDay) {
      throw new Error('Same day has already been added!');
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
          uniqueIdPrice: price.uniqueIdPrice,
        },
      ])
      .execute();

    return result.generatedMaps;
  }

  async checkIfSameDayHasAlreadyBeenInserted(
    splitedWeekDay: string[],
    companyId: number,
    uniqueIdPrice: string,
  ): Promise<boolean> {
    const prices = await this.priceRepository
      .createQueryBuilder()
      .select()
      .where('companyId = :companyId', { companyId })
      .getMany();

    let hasSameDay = false;
    prices.map(price => {
      const splitedReturn = price.weekDay.split('|');
      splitedReturn.map(day => {
        splitedWeekDay.map(dayParam => {
          if (day === dayParam && price.uniqueIdPrice !== uniqueIdPrice) {
            hasSameDay = true;
          }
        });
      });
    });

    return hasSameDay;
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

import { Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { DeleteResult, ObjectLiteral, Repository, UpdateResult } from 'typeorm';
import { InsertPriceDto } from './dto/insert-price.dto';
import { Price } from './price.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UpdateFixedPriceDto } from './dto/update-fixed-price.dto';

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
          maxPriceValue: price.maxPriceValue,
          gracePeriod: price.gracePeriod,
        },
      ])
      .execute();

    return result.identifiers;
  }

  async getPrices(companyId: number): Promise<Price[]> {
    const prices = await this.priceRepository
      .createQueryBuilder()
      .select([
        'id',
        'weekDay',
        'uniqueIdPrice',
        'companyId',
        'type',
      ])
      .groupBy('uniqueIdPrice')
      .having('companyId = :companyId', { companyId })
      .getRawMany();

      await Promise.all(prices.map(async item => {
        const prices = await this.getPriceByUniqueId(item.uniqueIdPrice)
        item['prices'] = prices;
      }))

    return prices;
  }

  async getPriceByUniqueId(uniqueIdPrice: number): Promise<Price[]> {
    const prices = await this.priceRepository
      .createQueryBuilder()
      .where('uniqueIdPrice = :uniqueIdPrice', { uniqueIdPrice })
      .getMany();

    return prices;
  }

  async getPriceByWeekday(
    weekday: string,
    companyId: number,
  ): Promise<Price[]> {
    const prices = await this.priceRepository
      .createQueryBuilder()
      .where('weekDay like :weekDay', { weekDay: `%${weekday}%` })
      .andWhere('companyId = :companyId', { companyId })
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

  async updatePriceByPriceId(
    priceId: number,
    priceDto: UpdateFixedPriceDto,
  ): Promise<UpdateResult> {
    const priceResult = await this.priceRepository
      .createQueryBuilder()
      .select()
      .where('id = :id', { id: priceId })
      .getOne();

    if (priceResult.weekDay !== priceDto.weekDay) {
      await this.checkIfSameDayHasAlreadyBeenInserted(
        priceDto.weekDay.split('|'),
        priceDto.companyId,
        priceDto.uniqueIdPrice,
      );
    }

    const result = await this.priceRepository
      .createQueryBuilder()
      .update()
      .set({
        weekDay: priceDto.weekDay,
        price: priceDto.price,
        to: priceDto.to,
        from: priceDto.from,
        maxPriceValue: priceDto.maxValue,
        gracePeriod: priceDto.gracePeriod,
      })
      .where('id = :id', { id: priceId })
      .andWhere('uniqueIdPrice = :uniqueIdPrice', {
        uniqueIdPrice: priceDto.uniqueIdPrice,
      })
      .execute();

    return result;
  }

  async deletePriceById(priceId: number): Promise<DeleteResult> {
    const result = await this.priceRepository
      .createQueryBuilder()
      .delete()
      .where('id = :id', { id: priceId })
      .execute();

    return result;
  }

  async deletePriceByUniqueId(uniqueIdPrice: number): Promise<DeleteResult> {
    const result = await this.priceRepository
      .createQueryBuilder()
      .delete()
      .where('uniqueIdPrice = :uniqueIdPrice', { uniqueIdPrice })
      .execute();

    return result;
  }
}

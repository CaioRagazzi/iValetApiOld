import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InsertResult, ObjectLiteral } from 'typeorm';
import { MonthlyPricesCreateDto } from './dto/monthly-prices-create.dto';
import { MonthlyPricesUpdateDto } from './dto/monthly-prices-update.dto';
import { MonthlyPrices } from './monthlyPrices.entity';
import { MonthlyPricesService } from './monthlyPrices.service';

@Controller('MonthlyPrices')
@UseGuards(AuthGuard('jwt'))
export class MonthlyPricesController {
  constructor(private monthlyPricesService: MonthlyPricesService) {}

  @Post()
  async create(
    @Body() monthlyPrices: MonthlyPricesCreateDto,
  ): Promise<ObjectLiteral> {
    try {
      const createdMonthlyPrice = await this.monthlyPricesService.create(
        monthlyPrices,
      );

      return createdMonthlyPrice.identifiers;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':monthlyPriceId')
  async update(
    @Body() monthlyPrices: MonthlyPricesUpdateDto,
    @Param('monthlyPriceId') monthlyPriceId: number,
  ): Promise<MonthlyPrices> {
    try {
      const updatedMonthlyPrice = await this.monthlyPricesService.update(
        monthlyPrices,
        monthlyPriceId,
      );

      return updatedMonthlyPrice;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':companyId')
  async get(@Param('companyId') companyId: number): Promise<MonthlyPrices[]> {
    try {
      const monthlyPrices = await this.monthlyPricesService.get(companyId);
      return monthlyPrices;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

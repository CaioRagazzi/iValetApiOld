import {
  Body,
  Controller,
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
  constructor(private monthlyCustomerService: MonthlyPricesService) {}

  @Post()
  async create(
    @Body() monthlyPrices: MonthlyPricesCreateDto,
  ): Promise<ObjectLiteral> {
    try {
      const createdMonthlyPrice = await this.monthlyCustomerService.create(
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
      const updatedMonthlyPrice = await this.monthlyCustomerService.update(
        monthlyPrices,
        monthlyPriceId,
      );

      return updatedMonthlyPrice;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

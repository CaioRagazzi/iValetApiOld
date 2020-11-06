import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { DeleteResult, ObjectLiteral } from 'typeorm';
import { GetPriceWeekdayDto } from './dto/get-price-weekday.dto';
import { InsertPriceDto } from './dto/insert-price.dto';
import { UpdateFixedPriceDto } from './dto/update-fixed-price.dto';
import { PriceService } from './price.service';

@UseGuards(AuthGuard('jwt'))
@Controller('price')
export class PriceController {
  constructor(private priceService: PriceService) {}

  @Post()
  async create(@Body() price: InsertPriceDto): Promise<ObjectLiteral> {
    try {
      const result = await this.priceService.create(price);

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get(':companyId')
  async GetPrices(
    @Param('companyId') companyId: number,
  ): Promise<ObjectLiteral> {
    try {
      const result = await this.priceService.getPrices(companyId);

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('uniqueId/:uniqueId')
  async GetPriceByUniqueId(
    @Param('uniqueId') uniqueId: number,
  ): Promise<ObjectLiteral> {
    try {
      const result = await this.priceService.getPriceByUniqueId(uniqueId);

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('week/day')
  async GetPriceByWeekday(
    @Query() request: GetPriceWeekdayDto,
  ): Promise<ObjectLiteral> {
    try {      
      const result = await this.priceService.getPriceByWeekday(
        request.weekday,
        +request.companyId,
      );

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Put(':priceId')
  async UpdatePriceByPriceId(
    @Param('priceId') priceId: number,
    @Body() updatePriceDto: UpdateFixedPriceDto,
  ): Promise<ObjectLiteral> {
    try {
      const result = await this.priceService.updatePriceByPriceId(
        priceId,
        updatePriceDto,
      );

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete()
  async DeletePriceById(
    @Query('priceId') priceId: number,
  ): Promise<DeleteResult> {
    try {
      const result = await this.priceService.deletePriceById(priceId);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete('uniqueId')
  async DeletePriceUniqueId(
    @Query('uniqueId') uniqueId: number,
  ): Promise<DeleteResult> {
    try {
      const result = await this.priceService.deletePriceByUniqueId(uniqueId);
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

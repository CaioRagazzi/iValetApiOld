import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ObjectLiteral } from 'typeorm';
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

  @Put(':priceId')
  async UpdatePriceByPriceId(
    @Param('priceId') priceId: number, @Body() updatePriceDto: UpdateFixedPriceDto
  ): Promise<ObjectLiteral> {
    try {
      const result = await this.priceService.updateFixedPrice(priceId, updatePriceDto);

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

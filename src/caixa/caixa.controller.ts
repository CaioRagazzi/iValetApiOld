import {
  Controller,
  HttpException,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ObjectLiteral } from 'typeorm';
import { CaixaService } from './caixa.service';
import { OpenCaixaDto } from './dto/open-caixa.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('caixa')
export class CaixaController {
  constructor(private caixaService: CaixaService) {}

  @Post('openCaixa')
  async openCaixa(@Query() openCaixa: OpenCaixaDto): Promise<ObjectLiteral> {
    try {
      const result = await this.caixaService.openCaixa(openCaixa.companyId);

      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

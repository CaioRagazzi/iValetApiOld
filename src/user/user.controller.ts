import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { SendEmailForgotPasswordDto } from '../sendEmail/dto/send-email-forgot-password.dto';
import { InsertResult, UpdateResult } from 'typeorm';
import { UserInsertDto } from './dto/insert-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import { CompanyService } from 'src/company/company.service';
import { UserCompanyService } from 'src/userCompany/userCompany.service';

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    private companyService: CompanyService,
    private userCompanyService: UserCompanyService,
  ) {}

  @Post()
  async create(@Body() user: UserInsertDto): Promise<InsertResult> {
    try {
      const userRet = await this.userService.create(user);
      return userRet;
    } catch (error) {
      throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  async GetById(@Param('userId') userId: number): Promise<any> {
    try {
      const user = await this.userService.findOneById(userId);

      const result = {
        ...user,
        companies: [],
      };

      if (user.perfil.name === 'company') {
        const userCompany = await this.userCompanyService.findOneByUserId(
          user.id,
        );
        await Promise.all(userCompany.map(async usrComp => {          
          const company = await this.companyService.findOneById(
            +usrComp.company,
          );
          result.companies.push(company);
        }));
      }

      return result;
    } catch (error) {
      if (error.sqlMessage === 'User not found') {
        throw new HttpException(error.sqlMessage, HttpStatus.NO_CONTENT);
      } else {
        throw new HttpException(error, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':userId')
  async Update(
    @Body() user: UserUpdateDto,
    @Param('userId') id: number,
  ): Promise<UpdateResult> {
    try {
      const userRet = await this.userService.update(id, user);
      return userRet;
    } catch (error) {
      throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
    }
  }

  @Put('update-password/me')
  async UpdatePassword(
    @Query('hash') hash: string,
    @Query('password') password: string,
  ): Promise<UpdateResult> {
    try {
      const userRet = await this.userService.updatePassword(hash, password);
      return userRet;
    } catch (error) {
      if (error.message) {
        throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
      } else {
        throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
      }
    }
  }

  @Post('SendEmailForgotPassword')
  async sendEmailForgotPassword(
    @Body() message: SendEmailForgotPasswordDto,
  ): Promise<void> {
    try {
      const userRet = await this.userService.findOneByEmail(message.to);
      if (userRet) {
        this.userService.sendEmailForgotPassword(message.to, userRet.id);
      } else {
        throw new HttpException('Error sending email', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
    }
  }
}

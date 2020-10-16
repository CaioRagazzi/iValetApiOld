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
import { User } from '../user/user.entity';
import { InsertResult, UpdateResult } from 'typeorm';
import { UserInsertDto } from './dto/insert-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

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
  async GetById(@Param('userId') userId: number): Promise<User> {
    try {
      const userRet = await this.userService.findOneById(userId);
      return userRet;
    } catch (error) {
      throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
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

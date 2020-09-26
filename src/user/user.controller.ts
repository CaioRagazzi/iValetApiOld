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
import { SendEmailDto } from 'src/senEmail/dto/send-email.dto';
import { User } from 'src/user/user.entity';
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
  @Get()
  async Get(): Promise<User[]> {
    try {
      const userRet = await this.userService.findAll();
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

  @Post('SendEmailForgotPassword')
  async sendEmailForgotPassword(
    @Body() message: SendEmailDto,
    @Query('userId') id: number,
  ): Promise<void> {
    try {
      const userRet = await this.userService.findOneById(id);
      if (userRet) {
        this.userService.sendEmailForgotPassword(
          message.to,
          message.subject,
          message.text,
        );
      } else {
        throw new HttpException('Error sending email', HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
    }
  }
}

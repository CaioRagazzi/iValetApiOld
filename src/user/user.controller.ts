import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpService,
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
import { UpdateResult } from 'typeorm';
import { UserInsertDto } from './dto/insert-user.dto';
import { UserUpdateDto } from './dto/update-user.dto';
import { UserCompanyInsertDto } from './dto/insert-user-company.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private httpService: HttpService,
    private userService: UserService,
  ) {}

  @Post()
  async create(@Body() user: UserInsertDto): Promise<any> {
    let userReturn;
    await this.httpService
      .post('http://localhost:3000/user', {
        name: user.name,
        password: user.password,
        email: user.email,
        perfil: user.perfil,
      })
      .toPromise()
      .then(res => {
        userReturn = res.data;
      })
      .catch(err => {
        throw new HttpException(err.response.data, HttpStatus.BAD_REQUEST);
      });

    return userReturn;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':userId')
  async GetById(@Param('userId') userId: number): Promise<User> {
    let userReturn;
    await this.httpService
      .get(`http://localhost:3000/user/${userId}`)
      .toPromise()
      .then(async res => {
        userReturn = res.data;
      })
      .catch(err => {
        throw new HttpException(err, HttpStatus.BAD_REQUEST);
      });

    return userReturn;
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('email/me')
  async GetByEmail(@Query('email') email: string): Promise<User> {
    let userReturn;
    await this.httpService
      .get(`http://localhost:3000/user/email/me`, { params: { email: email } })
      .toPromise()
      .then(res => {
        userReturn = res.data;
      })
      .catch(err => {
        throw new HttpException(err.response.data, HttpStatus.BAD_REQUEST);
      });

    return userReturn;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':userId')
  async Update(
    @Body() user: UserUpdateDto,
    @Param('userId') userId: number,
  ): Promise<UpdateResult> {
    let userReturn;
    await this.httpService
      .put(`http://localhost:3000/user/${userId}`, {
        name: user.name,
        password: user.password,
        email: user.email,
        perfil: user.perfil,
      })
      .toPromise()
      .then(res => {
        userReturn = res.data;
      })
      .catch(err => {
        throw new HttpException(err.response.data, HttpStatus.BAD_REQUEST);
      });

    return userReturn;
  }

  @Put('update-password/me')
  async UpdatePassword(
    @Query('hash') hash: string,
    @Query('password') password: string,
  ): Promise<UpdateResult> {
    let userReturn;
    await this.httpService
      .post(`http://localhost:3000/update-password/me`, null, {
        params: {
          hash,
          password,
        },
      })
      .toPromise()
      .then(res => {
        userReturn = res.data;
      })
      .catch(err => {
        throw new HttpException(err.response.data, HttpStatus.BAD_REQUEST);
      });

    return userReturn;
  }

  @Post('SendEmailForgotPassword')
  async sendEmailForgotPassword(
    @Body() message: SendEmailForgotPasswordDto,
  ): Promise<{ message: string }> {
    this.userService.publishToKafka(message.to);

    return { message: 'E-mail sent!' };
  }

  @Post('createUserCompany')
  async addUserAndCompany(
    @Body() userCompany: UserCompanyInsertDto,
  ): Promise<void> {
    let userReturn;
    await this.httpService
      .post('http://localhost:3000/usercompany/createUserCompany', {
        name: userCompany.name,
        password: userCompany.password,
        email: userCompany.email,
        perfil: userCompany.perfil,
        companyName: userCompany.companyName,
      })
      .toPromise()
      .then(res => {
        userReturn = res.data;
      })
      .catch(err => {
        throw new HttpException(err.response.data, HttpStatus.BAD_REQUEST);
      });

    return userReturn;
  }
}

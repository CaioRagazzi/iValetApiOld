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

@Controller('user')
export class UserController {
  constructor(private httpService: HttpService) {}

  @Post()
  async create(@Body() user: UserInsertDto): Promise<any> {
    let userReturn;
    await this.httpService
      .post('http://localhost:3000/user', {
        name: user.name,
        password: user.password,
        email: user.email,
        perfil: user.perfil,
        companyId: user.companyId,
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
        
        await Promise.all(userReturn.companies.map(async item => {
          await this.httpService
            .get(`http://localhost:3002/company/${item.companyId}`)
            .toPromise()
            .then(res => {
              item.companyName = res.data.name;
              delete item.id
            })
            .catch(err => {
              throw new HttpException(
                err.response.data,
                HttpStatus.BAD_REQUEST,
              );
            });
        }));        
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
  ): Promise<void> {
    let userReturn;
    await this.httpService
      .get(`http://localhost:3000/user/email/me`, {
        params: { email: message.to },
      })
      .toPromise()
      .then(res => {
        userReturn = res.data;
      })
      .catch(err => {
        throw new HttpException(err.response.data, HttpStatus.BAD_REQUEST);
      });

    await this.httpService
      .post(`http://localhost:3001/sendemailforgotpassword`, {
        to: userReturn.email,
        subject: 'esqueci a senha',
        userId: userReturn.id,
        userName: userReturn.name,
      })
      .toPromise()
      .then(res => {
        console.log(res.data);
      })
      .catch(err => {
        throw new HttpException(err.response.data, HttpStatus.BAD_REQUEST);
      });
  }

  @Post('addUserAndCompany')
  async addUserAndCompany(
    @Body() userCompany: UserCompanyInsertDto,
  ): Promise<void> {
    let companyId: number;
    await this.httpService
      .post('http://localhost:3002/company', {
        name: userCompany.companyName,
      })
      .toPromise()
      .then(res => {
        companyId = res.data.id;
      })
      .catch(err => {
        throw new HttpException(err.response.data, HttpStatus.BAD_REQUEST);
      });

    let userReturn;
    await this.httpService
      .post('http://localhost:3000/user', {
        name: userCompany.name,
        password: userCompany.password,
        email: userCompany.email,
        perfil: userCompany.perfil,
        companyId: [companyId],
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

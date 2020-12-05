import { Body, Controller, HttpService, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserLoginDto } from '../user/dto/login-user.dto';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private httpService: HttpService,
  ) {}

  @UseGuards(AuthGuard('local'))
  @Post()
  async login(@Body() user: UserLoginDto): Promise<{ access_token: string }> {    
    let userReturn;    
    await this.httpService
      .get(`http://localhost:3000/user/email/me`, {
        params: { email: user.username },
      })
      .toPromise()
      .then(res => {
        userReturn = res.data;
      })
      .catch(err => {
        console.log(err.response.data);
      });

    return this.authService.login(userReturn);
  }
}

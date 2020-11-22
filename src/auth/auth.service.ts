import { HttpService, Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private httpService: HttpService,
  ) {}

  async validateUser(user: string, pass: string): Promise<any> {
    let userReturn;

    await this.httpService
      .get(`http://localhost:3000/user/email/me`, { params: { email: user } })
      .toPromise()
      .then(res => {
        userReturn = res.data;
      })
      .catch(err => {
        console.log(err.response.data);
      });

    if (
      userReturn &&
      this.usersService.comparePassword(pass, userReturn.password)
    ) {
      return userReturn;
    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = {
      username: user.name,
      id: user.id,
      email: user.email,
      idPerfil: user.perfil,
    };
    
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

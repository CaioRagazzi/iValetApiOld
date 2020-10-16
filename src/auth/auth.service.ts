import { Injectable } from '@nestjs/common';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService
  ) { }

  async validateUser(user: string, pass: string): Promise<any> {
    const userReturn = await this.usersService.findOneByEmail(user);    
    
    if (userReturn && this.usersService.comparePassword(pass, userReturn.password)) {
      return userReturn;
    }
    return null;
  }

  async login(user: User): Promise<{ access_token: string }> {
    const payload = { username: user.name, id: user.id, email: user.email, idPerfil: user.perfil.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
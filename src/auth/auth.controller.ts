import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserLoginDto } from 'src/user/dto/login-user.dto';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService,
        private userService: UserService
    ) { }

    @UseGuards(AuthGuard('local'))
    @Post()
    async login(@Body() user: UserLoginDto): Promise<{access_token: string}> {
        const userReturn = await this.userService.findOne(user.username);
        
        return this.authService.login(userReturn);
    }
}
import { Body, Controller, HttpException, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { User } from 'src/user/user.entity';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private userService: UserService) { }

    @Post()
    async create(@Body() user: User): Promise<User> {
        try {
            const userRet = await this.userService.create(user);
            return userRet;
        } catch (error) {
            throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
        }
    }
}
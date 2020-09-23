import { Body, Controller, Get, HttpException, HttpStatus, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/user/user.entity';
import { UpdateResult } from 'typeorm';
import { UserUpdateDto } from './dto/update-user.dto';
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

    // @UseGuards(AuthGuard('jwt'))
    @Put(':userId')
    async Update(@Body() user: UserUpdateDto, @Param('userId') id: number): Promise<UpdateResult> {        
        try {
            const userRet = await this.userService.update(id, user);
            return userRet;
        } catch (error) {
            throw new HttpException(error.sqlMessage, HttpStatus.BAD_REQUEST);
        }
    }
}
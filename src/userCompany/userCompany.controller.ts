import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { UserCompanyInsertResponseDto } from 'src/userCompany/dto/userInsertResponse.dto';
import { UserCompanyInsertRequestDto } from './dto/userInsertRequest.dto';
import { UserCompanyService } from './userCompany.service';

@Controller('usercompany')
export class UserCompanyController {
  constructor(private userCompanyService: UserCompanyService) {}

  @Post('createUserCompany')
  async create(
    @Body() user: UserCompanyInsertRequestDto,
  ): Promise<UserCompanyInsertResponseDto> {
    try {
      const userCreated = await this.userCompanyService.createUserCompany(user);
      const userDtoResponse = new UserCompanyInsertResponseDto();
      userDtoResponse.email = userCreated.email;
      userDtoResponse.name = userCreated.name;
      userDtoResponse.perfil = userCreated.perfil;

      return userDtoResponse;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}
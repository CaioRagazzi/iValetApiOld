import { Injectable } from '@nestjs/common';
import { Company } from 'src/company/company.entity';
import { UserCompanyInsertRequestDto } from 'src/userCompany/dto/userInsertRequest.dto';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { getManager, Repository } from 'typeorm';
import { UserCompany } from './userCompany.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserCompanyService {
  constructor(
    @InjectRepository(UserCompany)
    private usercompanyRepository: Repository<UserCompany>,
    private userService: UserService,
  ) {}

  async findOneById(userCompanyId: number): Promise<UserCompany> {
    return await this.usercompanyRepository.findOne(userCompanyId);
  }

  async findOneByUserId(userId: number): Promise<UserCompany[]> {
    return await this.usercompanyRepository.find({
      where: { user: userId },
      loadRelationIds: true
    });
  }

  async createUserCompany(userDto: UserCompanyInsertRequestDto): Promise<User> {
    const duplicateUser = await this.userService.findOneByEmail(userDto.email);

    if (duplicateUser) {
      throw new Error(`User with email ${userDto.email} already exists`);
    }

    const user = new User();
    user.name = userDto.name;
    user.email = userDto.email;
    user.password = this.userService.hashPassword(userDto.password);
    user.perfil = userDto.perfil;
    user.createdAt = new Date();
    user.updatedAt = new Date();

    let createdUser: User;

    await getManager().transaction(async transaction => {
      const company = new Company();
      company.name = userDto.companyName;
      company.createdAt = new Date();
      company.updatedAt = new Date();
      const createdCompany = await transaction.save(company);
      createdUser = await transaction.save<User>(user);
      const userCompany = new UserCompany();
      userCompany.user = createdUser;
      userCompany.company = createdCompany;
      transaction.save<UserCompany>(userCompany);
    });

    return createdUser;
  }
}

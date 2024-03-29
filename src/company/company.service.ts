import { HttpService, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { InsertResult, Repository } from 'typeorm';
import { Company } from './company.entity';
import { CompanyInsertDto } from './dto/insert-company.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CompanyService {
  constructor(
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    private userService: UserService,
    private httpService: HttpService,
  ) {}

  async create(company: CompanyInsertDto): Promise<InsertResult> {
    const user = await this.userService.findOneById(company.user);

    const companyInst = new Company();
    companyInst.name = company.name;

    return this.companyRepository.insert(companyInst);
  }

  async findOneById(companyId: number): Promise<Company> {
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
    });

    if (!company) {
      throw new Error('Company does not exists!');
    }

    return company;
  }

  async deleteById(companyId: number): Promise<any> {
    let response;
    await this.httpService
      .delete(`http://localhost:3002/company/${companyId}`)
      .toPromise()
      .then(res => {
        response = res.data;
      })
      .catch(err => {
        throw new Error(err.response.data);
      });

    return response;
  }
}

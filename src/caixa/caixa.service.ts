import { Injectable, Inject } from '@nestjs/common';
import { CompanyService } from 'src/company/company.service';
import { ObjectLiteral, Repository } from 'typeorm';
import { Caixa } from './caixa.entity';

@Injectable()
export class CaixaService {
  constructor(
    @Inject('CAIXA_REPOSITORY')
    private caixaRepository: Repository<Caixa>,
    private companyService: CompanyService,
  ) {}

  async openCaixa(companyId: number): Promise<ObjectLiteral> {
    const company = await this.companyService.findOneById(companyId);

    if (!company) {
      throw new Error('Company does not existis');
    }

    const openedCaixa = await this.caixaRepository
      .createQueryBuilder()
      .where('closeDate is null')
      .andWhere('companyId = :companyId', { companyId })
      .getOne();

    if (openedCaixa) {
      throw new Error('This company has already a opened caixa!');
    }

    const insert = await this.caixaRepository
      .createQueryBuilder()
      .insert()
      .values({ company, openDate: new Date() })
      .execute();

    return insert.identifiers;
  }
}

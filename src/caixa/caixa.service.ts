import { Injectable } from '@nestjs/common';
import { CompanyService } from '../company/company.service';
import { ObjectLiteral, Repository } from 'typeorm';
import { Caixa } from './caixa.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class CaixaService {
  constructor(
    @InjectRepository(Caixa)
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

  async closeCaixa(companyId: number): Promise<ObjectLiteral> {
    const company = await this.companyService.findOneById(companyId);

    if (!company) {
      throw new Error('Company does not existis');
    }

    const openedCaixa = await this.caixaRepository
      .createQueryBuilder()
      .where('closeDate is null')
      .andWhere('companyId = :companyId', { companyId })
      .getOne();

    if (!openedCaixa) {
      throw new Error('This company has no caixa to close!');
    }

    const result = await this.caixaRepository
      .createQueryBuilder()
      .update()
      .set({ closeDate: new Date() })
      .where('id = :caixaId', { caixaId: openedCaixa.id })
      .execute();

    return result.generatedMaps;
  }

  async getOpenedCaixaByCompany(companyId: number): Promise<Caixa> {
    const caixa = await this.caixaRepository
      .createQueryBuilder()
      .where('closeDate is null')
      .andWhere('companyId = :companyId', { companyId })
      .getOne();

    return caixa;
  }
}

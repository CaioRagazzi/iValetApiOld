import { Injectable } from '@nestjs/common';
import { InsertResult, Repository, UpdateResult } from 'typeorm';
import { Transaction } from './transaction.entity';
import { InsertTransactionDto } from './dto/insert-transaction.dto';
import { CompanyService } from '../company/company.service';
import { CaixaService } from '../caixa/caixa.service';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private companyService: CompanyService,
    private caixaService: CaixaService,
  ) {}

  async create(transaction: InsertTransactionDto): Promise<InsertResult> {
    const company = await this.companyService.findOneById(
      transaction.companyId,
    );

    const caixa = await this.caixaService.getOpenedCaixaByCompany(
      transaction.companyId,
    );

    if (!caixa) {
      throw new Error('Theres no opened caixa!');
    }

    const transactionInst = new Transaction();
    transactionInst.placa = transaction.placa;
    transactionInst.company = company;
    transactionInst.startDate = new Date();
    transactionInst.prisma = transaction.prismaNumber;
    transactionInst.caixa = caixa;

    try {
      const transactionRe = await this.transactionRepository.insert(
        transactionInst,
      );
      
      return transactionRe;
    } catch (error) {
      return error;
    }
  }

  async checkIfCarAlreadyIn(
    placa: string,
    companyId: number,
  ): Promise<boolean> {
    const isCarIn = await this.transactionRepository
      .createQueryBuilder()
      .select()
      .where('placa = :placa', { placa })
      .andWhere('companyId = :companyId', { companyId })
      .andWhere('endDate is null')
      .getCount();

    return isCarIn > 0;
  }

  async getByCompanyId(companyId: number): Promise<Transaction[]> {
    const company = await this.companyService.findOneById(companyId);

    const transaction = this.transactionRepository.find({
      where: { company: company },
    });

    return transaction;
  }

  async getOpenedByCompanyId(companyId: number): Promise<Transaction[]> {
    const transaction = await this.transactionRepository
      .createQueryBuilder()
      .select('*')
      .where('endDate is null')
      .andWhere('companyId = :companyId', { companyId })
      .getRawMany();

    return transaction;
  }

  async getFinishedByCompanyId(companyId: number): Promise<Transaction[]> {
    const caixa = await this.caixaService.getOpenedCaixaByCompany(companyId);

    if (!caixa) {
      throw new Error('Theres no caixa opened!');
    }

    const transactions = await this.transactionRepository
      .createQueryBuilder()
      .select('id, placa, endDate, startDate')
      .where('caixaId = :caixaId', { caixaId: caixa.id })
      .andWhere('companyId = :companyId', { companyId })
      .andWhere('endDate is not null')
      .execute();

    return transactions;
  }

  async finishTransaction(
    transactionId: number,
  ): Promise<Transaction> {
    
    const transaction = await this.transactionRepository.findOne(transactionId);

    if (!transaction) {
      throw new Error('Transactions does not exists');
    }

    if (transaction.endDate !== null) {
      throw new Error('Transactions already finished');
    }

    transaction.endDate = new Date();

    const response = await this.transactionRepository.save(transaction);
    
    return response;
  }
}

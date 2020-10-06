import { Injectable, Inject } from '@nestjs/common';
import { InsertResult, Repository, Not, IsNull, UpdateResult } from 'typeorm';
import { Transaction } from './transaction.entity';
import { InsertTransactionDto } from './dto/insert-transaction.dto';
import { CompanyService } from 'src/company/company.service';
import { TransactionGateway } from 'src/gateway/transaction.gateway';
import { startOfDay, endOfDay } from 'date-fns';
import { CaixaService } from 'src/caixa/caixa.service';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private transactionRepository: Repository<Transaction>,
    private companyService: CompanyService,
    private transactionGateway: TransactionGateway,
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

      this.emitOpenedTransactions(company.id);
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
    companyId: number,
  ): Promise<UpdateResult> {
    const transaction = await this.transactionRepository
      .createQueryBuilder()
      .select('*')
      .where('id = :transactionId', { transactionId })
      .getRawOne();

    if (!transaction) {
      throw new Error('Transactions does not exists');
    }

    if (transaction.endDate !== null) {
      throw new Error('Transactions already finished');
    }

    const response = await this.transactionRepository
      .createQueryBuilder()
      .update()
      .set({ endDate: new Date() })
      .where('id = :transactionId', { transactionId })
      .execute();

    if (response.affected > 0) {
      this.emitFinishedTransactions(companyId);
      this.emitOpenedTransactions(companyId);
    }

    return response;
  }

  async emitOpenedTransactions(companyId: number): Promise<void> {
    const transactions = await this.getOpenedByCompanyId(companyId);
    this.transactionGateway.sendOpenedTransactionsMessage(
      companyId,
      transactions,
    );
  }

  async emitFinishedTransactions(companyId: number): Promise<void> {
    const transactions = await this.getFinishedByCompanyId(companyId);

    this.transactionGateway.sendFinishedTransactionsMessage(
      companyId,
      transactions,
    );
  }
}

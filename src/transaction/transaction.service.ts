import { Injectable, Inject } from '@nestjs/common';
import { InsertResult, Repository, Not, IsNull, UpdateResult } from 'typeorm';
import { Transaction } from './transaction.entity';
import { InsertTransactionDto } from './dto/insert-transaction.dto';
import { CompanyService } from 'src/company/company.service';
import { TransactionGateway } from 'src/gateway/transaction.gateway';

@Injectable()
export class TransactionService {
  constructor(
    @Inject('TRANSACTION_REPOSITORY')
    private transactionRepository: Repository<Transaction>,
    private companyService: CompanyService,
    private transactionGateway: TransactionGateway,
  ) {}

  async create(transaction: InsertTransactionDto): Promise<InsertResult> {
    const company = await this.companyService.findOneById(
      transaction.companyId,
    );

    const transactionInst = new Transaction();
    transactionInst.placa = transaction.placa;
    transactionInst.company = company;
    transactionInst.startDate = new Date();

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
    const company = await this.companyService.findOneById(companyId);

    const isCarIn = await this.transactionRepository.findAndCount({
      where: { placa: placa, company: company, endDate: null },
    });

    return isCarIn[1] > 0;
  }

  async getByCompanyId(companyId: number): Promise<Transaction[]> {
    const company = await this.companyService.findOneById(companyId);

    const transaction = this.transactionRepository.find({
      where: { company: company },
    });

    return transaction;
  }

  async getOpenedByCompanyId(companyId: number): Promise<Transaction[]> {
    const company = await this.companyService.findOneById(companyId);

    const transaction = this.transactionRepository.find({
      where: { company: company, endDate: null },
    });

    return transaction;
  }

  async getFinishedByCompanyId(companyId: number): Promise<Transaction[]> {
    const company = await this.companyService.findOneById(companyId);

    const transaction = this.transactionRepository.find({
      where: { company: company, endDate: Not(IsNull()) },
    });

    return transaction;
  }

  async finishTransaction(transactionId: number): Promise<UpdateResult> {
    const transaction = await this.transactionRepository.findOne(transactionId);

    if (transaction.endDate !== null) {
      throw new Error('Transactions already finished');
    }

    transaction.endDate = new Date();
    const response = await this.transactionRepository.update(
      transactionId,
      transaction,
    );

    return response;
  }

  async emitOpenedTransactions(companyId: number): Promise<void> {
    const transactions = await this.getOpenedByCompanyId(companyId);

    this.transactionGateway.sendOpenedTransactionsMessage(
      companyId,
      transactions,
    );
  }
}

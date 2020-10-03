import { Injectable, Inject } from '@nestjs/common';
import { InsertResult, Repository } from 'typeorm';
import { Transaction } from './transaction.entity';
import { InsertTransactionDto } from './dto/insert-transaction.dto';
import { CompanyService } from 'src/company/company.service';
import { TransactionGateway } from './transaction.gateway';

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

    try {
      const transactionRe = await this.transactionRepository.insert(
        transactionInst,
      );

      this.emitTransactions(company.id);
      return transactionRe;
    } catch (error) {
      return error;
    }
  }

  async getByCompanyId(companyId: number): Promise<Transaction[]> {
    const company = await this.companyService.findOneById(companyId);

    const transaction = this.transactionRepository.find({
      where: { company: company },
    });

    return transaction;
  }

  async emitTransactions(companyId: number): Promise<void> {
    const transactions = await this.getByCompanyId(companyId);

    this.transactionGateway.wss.emit('msgToClient', { transactions });
  }
}

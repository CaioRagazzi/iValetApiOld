import { TransactionGateway } from 'src/gateway/transaction.gateway';
import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
  } from 'typeorm';
  import { Transaction } from './transaction.entity';
import { TransactionService } from './transaction.service';
  
  @EventSubscriber()
  export class TransactionSubscriber implements EntitySubscriberInterface<Transaction> {
    constructor(connection: Connection, private transactionGateway: TransactionGateway, private transactionService: TransactionService) {
      connection.subscribers.push(this);
    }
  
    listenTo() {
      return Transaction;
    }

    afterInsert(event: InsertEvent<any>): void{        
      this.emitOpenedTransactions(event.entity.company.id);
    }

    afterUpdate(event: InsertEvent<any>): void {
      this.emitFinishedTransactions(event.entity.company.id);
      this.emitOpenedTransactions(event.entity.company.id);
    }

    async emitOpenedTransactions(companyId: number): Promise<void> {
        const transactions = await this.transactionService.getOpenedByCompanyId(companyId);
        
        this.transactionGateway.sendOpenedTransactionsMessage(
          companyId,
          transactions,
        );
      }
    
      async emitFinishedTransactions(companyId: number): Promise<void> {
        let transactions: Transaction[];
        try {
          transactions = await this.transactionService.getFinishedByCompanyId(companyId);
    
          this.transactionGateway.sendFinishedTransactionsMessage(
            companyId,
            transactions,
          );
        } catch (error) {
          
        }
      }
  }
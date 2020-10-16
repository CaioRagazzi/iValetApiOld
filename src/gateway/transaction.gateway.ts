import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Transaction } from '../transaction/transaction.entity';
import { verify } from 'jsonwebtoken';

@WebSocketGateway()
export class TransactionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;

  handleDisconnect(client: Socket): void {}

  handleConnection(client: Socket, ...args: any[]): void {
    verify(client.handshake.query.token, process.env.JWT_KEY, function(err) {
      if (err) {
        client.disconnect();
      }
    });
  }

  afterInit(server: Server): void {}

  sendOpenedTransactionsMessage(
    companyId: number,
    transactions: Transaction[],
  ): void {
    this.wss.emit(`openedTransactions:company:${companyId}`, transactions);
  }

  sendFinishedTransactionsMessage(
    companyId: number,
    transactions: Transaction[],
  ): void {
    this.wss.emit(`finishedTransactions:company:${companyId}`, transactions);
  }
}

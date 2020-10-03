import { Logger } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Transaction } from 'src/transaction/transaction.entity';

@WebSocketGateway()
export class TransactionGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server;
  private logger: Logger = new Logger('AppGateway');

  handleDisconnect(client: Socket): void {
    this.logger.log(`Disconnected ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]): void {
    console.log(...args);

    this.logger.log(`Connected ${client.id}`);
  }

  afterInit(server: Server): void {
    this.logger.log(`Initialized server: ${server}`);
  }

  sendMessage(companyId: number, transaction: Transaction[]): void {
    this.wss.emit(`msgToClient:company:${companyId}`, transaction);    
  }
}

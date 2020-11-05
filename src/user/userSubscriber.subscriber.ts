import { CustomerService } from 'src/customer/customer.service';
import {
    Connection,
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
  } from 'typeorm';
  import { User } from './user.entity';
  
  @EventSubscriber()
  export class UserSubscriber implements EntitySubscriberInterface<User> {
    constructor(connection: Connection, private customerService: CustomerService) {
      connection.subscribers.push(this);
    }
  
    listenTo() {
      return User;
    }

    afterInsert(event: InsertEvent<any>): void{
        if (event.entity.perfil.id === 2) {
          this.customerService.addCustomer(event.entity)
        }
    }
  }
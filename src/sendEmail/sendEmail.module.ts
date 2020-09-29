import { Module } from '@nestjs/common';
import { SendEmailService } from './sendEmail.service';

@Module({
  providers: [SendEmailService],
  exports: [SendEmailService],
})
export class SendEmailModule {}

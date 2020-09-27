import { Injectable } from '@nestjs/common';
import { createTransport } from 'nodemailer';
import { MailOptions } from 'nodemailer/lib/json-transport';
import Mail from 'nodemailer/lib/mailer';

@Injectable()
export class SendEmailService {
  transporter: Mail;
  options: MailOptions = {
    from: process.env.EMAIL_USER
  }

  constructor() {
    this.transporter = createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  sendEmail(
    to: string,
    subject: string,
    text: string,
  ): void {
    this.options.to = to;
    this.options.subject = subject;
    this.options.text = text;
    this.options.html = text;

    this.transporter.sendMail(this.options);
  }
}

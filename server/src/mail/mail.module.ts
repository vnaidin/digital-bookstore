import { Global, Module } from '@nestjs/common';
import * as path from 'path';

import { MailService } from '@/mail/mail.service';

import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/adapters/handlebars.adapter';

@Global()
@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: process.env.EMAIL_SENDER,
          pass: process.env.EMAIL_SENDER_PASS,
        },
      },
      defaults: { from: process.env.EMAIL_SENDER },
      template: {
        dir: path.join(process.cwd(), 'views'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: false,
          partials: {
            dir: path.join(process.cwd(), 'views/partials'),
          },
        },
      },
    }),
  ],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}

import { Injectable, Logger } from '@nestjs/common';

import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private mailer: MailerService) {}

  send(options: { to: string; subject: string; template: string; context?: Record<string, any> }) {
    this.mailer.sendMail(options).catch((err) => this.logger.error('Mail error', err));
  }
}

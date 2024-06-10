import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

import { NotifierEmailOptions } from '@/modules/notifier/types/notifier';

@Injectable()
export class NotifierService {
  private readonly logger = new Logger(NotifierService.name);

  constructor(private readonly mailerService: MailerService) {}

  public async sendMail<T>(options: NotifierEmailOptions<T>): Promise<void> {
    try {
      await this.mailerService.sendMail({
        ...options,
        template: `./${options.template}`,
      });
    } catch (error) {
      this.logger.error(error.message, error.stack);
    }
  }
}

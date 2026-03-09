import { Module } from '@nestjs/common';
import { MailConfigModule } from './mail-config.module';
import { EmailService } from './email.service';

@Module({
  imports: [MailConfigModule],
  providers: [EmailService],
  exports: [EmailService],
})
export class MailModule {}

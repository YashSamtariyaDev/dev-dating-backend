import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('SMTP_HOST') || 'smtp.gmail.com',
          port: configService.get<number>('SMTP_PORT') || 587,
          secure: configService.get<string>('SMTP_SECURE') === 'true',
          auth: {
            user: configService.get<string>('SMTP_USER'),
            pass: configService.get<string>('SMTP_PASS'),
          },
          tls: {
            rejectUnauthorized: false, // Often needed in cloud environments
          },
          connectionTimeout: 10000, // 10 seconds
          greetingTimeout: 10000,   // 10 seconds
        },
        defaults: {
          from: `"${configService.get<string>('APP_NAME') || 'DevDating'}" <${configService.get<string>('SMTP_FROM') || 'noreply@devdating.com'}>`,
        },
        template: {
          dir: (() => {
            const distTemplatesDir = join(__dirname, 'templates');
            if (existsSync(distTemplatesDir)) return distTemplatesDir;
            return join(process.cwd(), 'src', 'modules', 'mail', 'templates');
          })(),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],
  exports: [MailerModule],
})
export class MailConfigModule { }

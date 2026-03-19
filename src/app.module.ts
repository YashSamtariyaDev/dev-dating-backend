import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfileModule } from './modules/profile/profile.module';
import { MatchingModule } from './modules/matching/matching.module';
import { ChatModule } from './modules/chat/chat.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { MailModule } from './modules/mail/mail.module';
import { AccountModule } from './modules/account/account.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { databaseConfig } from './config/database.config';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    AuthModule,
    UsersModule,
    ProfileModule,
    MatchingModule,
    ChatModule,
    RecommendationModule,
    MailModule,
    AccountModule,
    ConfigModule.forRoot({
      isGlobal: true,
      // No envFilePath means it will only look for environment variables
      // or a default .env in the current directory if it exists.
      // This is better for Docker environments where variables are injected.
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }

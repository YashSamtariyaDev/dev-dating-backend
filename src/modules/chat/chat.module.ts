import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { StringValue } from 'ms';

import { ChatRoom } from './entities/chat-room.entity';
import { Match } from '../matching/entities/match.entity';
import { ChatRoomRepository } from './repositories/chat-room.repository';
import { ChatService } from './services/chat.service';
import { ChatController } from './controllers/chat.controller';
import { UsersModule } from '../users/users.module';
import { MatchingModule } from '../matching/matching.module';
import { MatchListener } from './listeners/match.listener';
import { MessageModule } from '../message/message.module';
import { ChatGateway } from './gateways/chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatRoom, Match]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.getOrThrow<string>('JWT_ACCESS_SECRET'),
        signOptions: {
          expiresIn: configService.getOrThrow<string>('JWT_ACCESS_EXPIRE') as StringValue,
        },
      }),
    }),
    UsersModule,
    MatchingModule,
    forwardRef(() => MessageModule),
  ],
  providers: [
    ChatService,
    ChatRoomRepository,
    MatchListener,
    ChatGateway,
  ],
  controllers: [ChatController],
  exports: [ChatService],
})
export class ChatModule {}
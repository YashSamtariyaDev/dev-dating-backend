import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

import { ChatRoom } from './entities/chat-room.entity';
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
    TypeOrmModule.forFeature([ChatRoom]),
    JwtModule.register({}),
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
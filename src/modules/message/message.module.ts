import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Message } from './entities/message.entity';
import { ChatModule } from '../chat/chat.module';
import { MessageController } from './controllers/message.controller';
import { MessageService } from './services/message.service';
import { MessageRepository } from './repositories/message.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message]),
    forwardRef(() => ChatModule),
  ],
  controllers: [MessageController],
  providers: [MessageService, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
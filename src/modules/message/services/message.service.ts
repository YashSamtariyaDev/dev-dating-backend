import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SendMessageDto } from '../dto/send-message.dto';
import { ChatService } from '../../chat/services/chat.service';
import { MessageRepository } from '../repositories/message.repository';

@Injectable()
export class MessageService {
  constructor(
    @Inject(forwardRef(() => ChatService))
    private readonly chatService: ChatService,

    private readonly messageRepo: MessageRepository,
  ) {}

  async sendMessage(userId: number, dto: SendMessageDto) {
    const chatRoom = await this.chatService.findById(dto.chatRoomId);

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    return this.messageRepo.createMessage(dto.chatRoomId, userId, dto.content);
  }

  async getMessages(chatRoomId: number) {
    return this.messageRepo.getMessages(chatRoomId);
  }

  async createMessage(chatRoomId: number, senderId: number, content: string) {
    return this.messageRepo.createMessage(chatRoomId, senderId, content);
  }
}

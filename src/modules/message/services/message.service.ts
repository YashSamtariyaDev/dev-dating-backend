import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { SendMessageDto } from '../dto/send-message.dto';
import { ChatService } from '../../chat/services/chat.service';
import { MessageRepository } from '../repositories/message.repository';
import { MessageStatus } from '../entities/message.entity';

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

  async getAllMessages(chatRoomId: number) {
    return this.messageRepo.getAllMessages(chatRoomId);
  }

  async getMessages(chatRoomId: number, page = 1, limit = 20) {
    return this.messageRepo.getMessages(chatRoomId, page, limit);
  }

  async createMessage(chatRoomId: number, senderId: number, content: string) {
    return this.messageRepo.createMessage(chatRoomId, senderId, content);
  }

  async getUnreadCount(chatRoomId: number, userId: number) {
    return this.messageRepo.getUnreadCount(chatRoomId, userId);
  }

  async markAsDelivered(chatRoomId: number, userId: number) {
    const chatRoom = await this.chatService.findById(chatRoomId);
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    await this.messageRepo.markAsDelivered(chatRoomId, userId);
  }

  async markAsRead(chatRoomId: number, userId: number) {
    const chatRoom = await this.chatService.findById(chatRoomId);
    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    await this.messageRepo.markAsRead(chatRoomId, userId);
  }
}

import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ChatRoomRepository } from '../repositories/chat-room.repository';
import { UsersService } from '../../users/services/users.service';
import { MessageService } from '../../message/services/message.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly chatRoomRepo: ChatRoomRepository,
    private readonly usersService: UsersService,

    @Inject(forwardRef(() => MessageService))
    private readonly messageService: MessageService,
  ) {}

  async sendMessage(userId: number, chatRoomId: number, message: string) {
    const sender = await this.usersService.findById(userId);

    if (!sender) {
      throw new NotFoundException('User not found');
    }

    const chatRoom = await this.chatRoomRepo.findById(chatRoomId);

    if (!chatRoom) {
      throw new NotFoundException('Chat room not found');
    }

    return this.messageService.createMessage(chatRoom.id, sender.id, message);
  }

  async getUserChats(userId: number) {
    return this.chatRoomRepo.getUserChats(userId);
  }

  async getUnreadCount(chatRoomId: number, userId: number) {
    return this.messageService.getUnreadCount(chatRoomId, userId);
  }

  async getMessages(chatRoomId: number, page = 1, limit = 20) {
    return this.messageService.getMessages(chatRoomId, page, limit);
  }

  async findById(id: number) {
    return this.chatRoomRepo.findById(id);
  }
}

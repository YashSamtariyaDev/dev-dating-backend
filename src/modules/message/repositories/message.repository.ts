import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from '../entities/message.entity';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async getMessages(chatRoomId: number) {
    return this.messageRepo.find({
      where: { chatRoomId },
      order: { createdAt: 'ASC' },
    });
  }

  async createMessage(chatRoomId: number, senderId: number, content: string) {
    const message = this.messageRepo.create({
      chatRoomId,
      senderId,
      content,
    });

    return this.messageRepo.save(message);
  }
}
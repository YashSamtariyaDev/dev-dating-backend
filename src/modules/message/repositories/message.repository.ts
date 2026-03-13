import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message, MessageStatus } from '../entities/message.entity';

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepo: Repository<Message>,
  ) {}

  async getAllMessages(chatRoomId: number) {
    return this.messageRepo.find({
      where: { chatRoomId },
      order: { createdAt: 'ASC' },
      relations: ['sender'],
    });
  }

  async getMessages(chatRoomId: number, page = 1, limit = 20) {
    return this.messageRepo.find({
      where: { chatRoomId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['sender'],
    });
  }

  async getUnreadCount(chatRoomId: number, userId: number) {
    return this.messageRepo
      .createQueryBuilder('message')
      .where('message.chatRoomId = :chatRoomId', { chatRoomId })
      .andWhere('message.senderId != :userId', { userId })
      .andWhere('message.status = :status', { status: MessageStatus.SENT })
      .getCount();
  }

  async createMessage(chatRoomId: number, senderId: number, content: string) {
    const message = this.messageRepo.create({
      chatRoomId,
      senderId,
      content,
    });

    return this.messageRepo.save(message);
  }

  async markAsDelivered(chatRoomId: number, userId: number) {
    await this.messageRepo
      .createQueryBuilder()
      .update(Message)
      .set({ status: MessageStatus.DELIVERED })
      .where('chatRoomId = :chatRoomId', { chatRoomId })
      .andWhere('senderId != :userId', { userId })
      .andWhere('status = :status', { status: MessageStatus.SENT })
      .execute();
  }

  async markAsRead(chatRoomId: number, userId: number) {
    await this.messageRepo
      .createQueryBuilder()
      .update(Message)
      .set({ status: MessageStatus.READ })
      .where('chatRoomId = :chatRoomId', { chatRoomId })
      .andWhere('senderId != :userId', { userId })
      .andWhere('status = :status', { status: MessageStatus.DELIVERED })
      .execute();
  }
}
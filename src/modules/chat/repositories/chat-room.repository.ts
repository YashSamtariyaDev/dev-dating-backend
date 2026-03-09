import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoom } from '../entities/chat-room.entity';
import { Match } from '../../matching/entities/match.entity';

@Injectable()
export class ChatRoomRepository {
  constructor(
    @InjectRepository(ChatRoom)
    private readonly repo: Repository<ChatRoom>,
  ) {}

  createRoom(match: Match) {
    const room = this.repo.create({ match });
    return this.repo.save(room);
  }

  findByMatch(matchId: number) {
    return this.repo.findOne({
      where: { match: { id: matchId } },
      relations: ['match'],
    });
  }

  findById(id: number) {
    return this.repo.findOne({ where: { id } });
  }

  async getUserChats(userId: number) {
    return this.repo
      .createQueryBuilder("chat")
      .leftJoin("chat.match", "match")
      .leftJoin("match.user1", "user1")
      .leftJoin("match.user2", "user2")
      .where("user1.id = :userId OR user2.id = :userId", { userId })
      .orderBy("chat.createdAt", "DESC")
      .getMany();
  }
}

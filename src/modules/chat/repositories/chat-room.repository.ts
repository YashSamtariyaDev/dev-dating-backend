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
}

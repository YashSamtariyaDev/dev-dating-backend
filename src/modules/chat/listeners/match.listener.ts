import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatRoomRepository } from '../repositories/chat-room.repository';
import { MatchCreatedEvent } from '../../matching/events/match-created.event';
import { Match } from '../../matching/entities/match.entity';

@Injectable()
export class MatchListener {
  constructor(
    private readonly chatRoomRepo: ChatRoomRepository,
    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,
  ) {}

  @OnEvent('match.created')
  async handleMatchCreated(event: MatchCreatedEvent) {
    console.log('🔥 Match created event triggered for match ID:', event.matchId);

    try {
      // Simple query to get match with minimal relations
      const match = await this.matchRepo.findOne({
        where: { id: event.matchId },
      });

      if (!match) {
        console.log('❌ Match not found for id:', event.matchId);
        return;
      }

      console.log('✅ Found match:', match.id);
      
      // Create chat room with just the match entity
      const room = await this.chatRoomRepo.createRoom(match);
      console.log('💬 Chat room created:', room.id);
    } catch (error) {
      console.error('❌ Error creating chat room:', error.message);
    }
  }
}
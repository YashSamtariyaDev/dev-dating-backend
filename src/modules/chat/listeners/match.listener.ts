import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ChatRoomRepository } from '../repositories/chat-room.repository';
import { MatchingService } from '../../matching/services/matching.service';
import { MatchCreatedEvent } from '../../matching/events/match-created.event';

@Injectable()
export class MatchListener {
  constructor(
    private readonly chatRoomRepo: ChatRoomRepository,

    private readonly matchingService: MatchingService,
  ) {}

  @OnEvent('match.created')
  async handleMatchCreated(event: MatchCreatedEvent) {
    console.log('🔥 Match created event triggered');

    try {
      const match = await this.matchingService.getMatchById(event.matchId);

      if (!match) {
        console.log('❌ Match not found for id:', event.matchId);
        return;
      }

      console.log('✅ Found match:', match.id);
      await this.chatRoomRepo.createRoom(match);
      console.log('💬 Chat room created for match');
    } catch (error) {
      console.error('❌ Error creating chat room:', error);
    }
  }
}
import {
  Injectable,
  BadRequestException,
} from '@nestjs/common';
import { Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Match } from '../entities/match.entity';
import { CreateSwipeDto } from '../dto/create-swipe.dto';
import { Swipe, SwipeType } from '../entities/swipe.entity';
import { UsersService } from '../../users/services/users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { MatchCreatedEvent } from '../events/match-created.event';

@Injectable()
export class MatchingService {
  constructor(
    @InjectRepository(Swipe)
    private readonly swipeRepo: Repository<Swipe>,

    @InjectRepository(Match)
    private readonly matchRepo: Repository<Match>,

    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,

    private readonly dataSource: DataSource,

    private readonly eventEmitter: EventEmitter2,
  ) {}

  async createSwipe(userId: number, dto: CreateSwipeDto) {
    if (userId === dto.targetId) {
      throw new BadRequestException('You cannot swipe yourself');
    }

    const swiper = await this.usersService.findById(userId);
    if (!swiper) {
      throw new BadRequestException('User not found');
    }

    const target = await this.usersService.findById(dto.targetId);
    if (!target) {
    throw new BadRequestException('Target user not found');
    }

    const existingSwipe = await this.swipeRepo.findOne({
      where: {
        swiper: { id: userId },
        target: { id: dto.targetId },
      },
      relations: ['swiper', 'target'],
    });

    if (existingSwipe) {
      throw new BadRequestException('You already swiped this user');
    }

    return this.dataSource.transaction(async (manager) => {
      const swipe = manager.create(Swipe, {
        swiper,
        target,
        type: dto.type,
      });

      await manager.save(swipe);

      // If LIKE or SUPER_LIKE → check mutual
      if (
        dto.type === SwipeType.LIKE ||
        dto.type === SwipeType.SUPER_LIKE
      ) {
        const reverseSwipe = await manager.findOne(Swipe, {
          where: {
            swiper: { id: dto.targetId },
            target: { id: userId },
            type: SwipeType.LIKE,
          },
          relations: ['swiper', 'target'],
        });

        if (reverseSwipe) {
          const match = manager.create(Match, {
            user1: swiper,
            user2: target,
          });

          const savedMatch = await manager.save(match);

          this.eventEmitter.emit(
            'match.created',
            new MatchCreatedEvent(
              savedMatch.id,
              swiper.id,
              target.id,
            ),
          );

          return {
            message: 'It’s a match!',
            match,
          };
        }
      }

      return { message: 'Swipe recorded' };
    });
  }

  async getUserMatches(userId: number) {
    const matches = await this.matchRepo.find({
      where: [
        { user1: { id: userId } },
        { user2: { id: userId } },
      ],
      relations: ['user1', 'user2'],
      order: { matchedAt: 'DESC' },
    });

    // Return only the other user
    return matches.map(match => {
      const otherUser =
        match?.user1.id === userId ? match.user2 : match.user1;

      return {
        matchId: match.id,
        matchedAt: match.matchedAt,
        user: {
          id: otherUser.id,
          email: otherUser.email,
          name: otherUser.name,
        },
      };
    });
  }

  async getSwipedUserIds(userId: number) {
    const swipes = await this.swipeRepo.find({
      where: { swiper: { id: userId } },
      relations: ['target'],
    });

    return swipes.map(s => s.target.id);
  }

  async getMatchedUserIds(userId: number) {
    const matches = await this.matchRepo.find({
      where: [
        { user1: { id: userId } },
        { user2: { id: userId } },
      ],
      relations: ['user1', 'user2'],
    });

    return matches.map(match =>
      match.user1.id === userId
        ? match.user2.id
        : match.user1.id,
    );
  }

  async getMatchById(matchId: number): Promise<Match | null> {
    return this.matchRepo.findOne({
      where: { id: matchId },
      relations: ['user1', 'user2'],
    });
  }
}

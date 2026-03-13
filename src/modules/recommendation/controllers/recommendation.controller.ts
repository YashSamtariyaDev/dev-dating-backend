import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { RecommendationService, FeedOptions } from '../services/recommendation.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { FeedUserDto } from '../../users/dto/user-feed.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class RecommendationController {
  constructor(private readonly recommendationService: RecommendationService) {}

  @Get('feed')
  async getFeed(
    @Req() req,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('minAge') minAge?: string,
    @Query('maxAge') maxAge?: string,
    @Query('maxDistance') maxDistance?: string,
  ) {
    const userId = req.user.userId;
    
    const options: FeedOptions = {
      page: page ? parseInt(page) : undefined,
      limit: limit ? parseInt(limit) : undefined,
      minAge: minAge ? parseInt(minAge) : undefined,
      maxAge: maxAge ? parseInt(maxAge) : undefined,
      maxDistance: maxDistance ? parseInt(maxDistance) : undefined,
    };

    const feed = await this.recommendationService.getUserFeed(userId, options);
    
    return {
      success: true,
      data: feed.map(u => this.mapToFeedDto(u)),
      pagination: {
        page: options.page || 1,
        limit: options.limit || 20,
        total: feed.length,
      },
    };
  }

  @Get('feed/stats')
  async getFeedStats(@Req() req) {
    const userId = req.user.userId;
    
    // Get basic stats about the user's feed
    const unlimitedFeed = await this.recommendationService.getUserFeed(userId, { limit: 1000 });
    
    const stats = {
      totalCandidates: unlimitedFeed.length,
      averageMatchScore: unlimitedFeed.reduce((sum, user) => sum + user.matchScore, 0) / unlimitedFeed.length || 0,
      averageDistance: unlimitedFeed
        .filter(user => user.distance !== undefined)
        .reduce((sum, user) => sum + (user.distance || 0), 0) / 
        unlimitedFeed.filter(user => user.distance !== undefined).length || 0,
      ageRange: {
        min: Math.min(...unlimitedFeed.map(user => user.age).filter(age => age > 0)),
        max: Math.max(...unlimitedFeed.map(user => user.age).filter(age => age > 0)),
      },
      genderDistribution: unlimitedFeed.reduce((acc, user) => {
        acc[user.gender] = (acc[user.gender] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };

    return {
      success: true,
      data: stats,
    };
  }

  private mapToFeedDto(user: any): FeedUserDto {
    return {
      id: user.id,
      name: user.name,
      bio: user.bio,
      age: user.age,
      gender: user.gender,
      techStack: user.techStack,
      experienceLevel: user.experienceLevel,
      location: user.location,
      distance: user.distance,
      matchScore: user.matchScore,
    };
  }
}

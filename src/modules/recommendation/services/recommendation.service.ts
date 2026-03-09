import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Profile } from '../../profile/entities/profile.entity';
import { Gender, LookingFor } from '../../profile/entities/profile.entity';

export interface FeedUser {
  id: number;
  name: string;
  bio: string;
  age: number;
  gender: Gender;
  techStack: string[];
  experienceLevel: string;
  location: string;
  distance?: number;
  matchScore: number;
}

export interface FeedOptions {
  page?: number;
  limit?: number;
  minAge?: number;
  maxAge?: number;
  maxDistance?: number;
}

@Injectable()
export class RecommendationService {
  constructor(
    @InjectRepository(Profile)
    private readonly profileRepo: Repository<Profile>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async getUserFeed(userId: number, options: FeedOptions = {}): Promise<FeedUser[]> {
    const {
      page = 1,
      limit = 20,
      minAge,
      maxAge,
      maxDistance
    } = options;

    // Get current user's profile
    const currentUserProfile = await this.profileRepo.findOne({
      where: { user: { id: userId } },
      relations: ['user']
    });

    if (!currentUserProfile) {
      throw new Error('User profile not found');
    }

    // Build base query
    const queryBuilder = this.profileRepo
      .createQueryBuilder('profile')
      .leftJoinAndSelect('profile.user', 'user')
      .where('user.id != :userId', { userId }) // Exclude self
      .andWhere('user.isActive = :isActive', { isActive: true }) // Only active users
      .andWhere('profile.isComplete = :isComplete', { isComplete: true }); // Only complete profiles

    // Apply gender preference filtering
    this.applyGenderFilter(queryBuilder, currentUserProfile);

    // Apply age filtering
    this.applyAgeFilter(queryBuilder, currentUserProfile, minAge, maxAge);

    // Apply location filtering
    if (maxDistance && currentUserProfile.latitude && currentUserProfile.longitude) {
      this.applyLocationFilter(queryBuilder, currentUserProfile, maxDistance);
    }

    // Get candidates
    const candidates = await queryBuilder
      .limit(limit)
      .offset((page - 1) * limit)
      .getMany();

    // Calculate match scores and distances
    const feedUsers: FeedUser[] = [];
    for (const candidate of candidates) {
      const distance = this.calculateDistance(
        currentUserProfile.latitude,
        currentUserProfile.longitude,
        candidate.latitude,
        candidate.longitude
      );

      const matchScore = this.calculateMatchScore(currentUserProfile, candidate);

      feedUsers.push({
        id: candidate.user.id,
        name: candidate.user.name,
        bio: candidate.bio || '',
        age: candidate.age || 0,
        gender: candidate.gender,
        techStack: candidate.techStack || [],
        experienceLevel: candidate.experienceLevel || '',
        location: candidate.location || '',
        distance: distance,
        matchScore: matchScore
      });
    }

    // Sort by match score (highest first)
    feedUsers.sort((a, b) => b.matchScore - a.matchScore);

    return feedUsers;
  }

  private applyGenderFilter(
    queryBuilder: any,
    currentUserProfile: Profile
  ): void {
    if (!currentUserProfile.lookingFor) {
      return; // No preference set
    }

    if (currentUserProfile.lookingFor === LookingFor.BOTH) {
      return; // No filtering needed
    }

    queryBuilder.andWhere('profile.gender = :preferredGender', {
      preferredGender: currentUserProfile.lookingFor
    });
  }

  private applyAgeFilter(
    queryBuilder: any,
    currentUserProfile: Profile,
    minAge?: number,
    maxAge?: number
  ): void {
    const userMinAge = minAge || currentUserProfile.minAge || 18;
    const userMaxAge = maxAge || currentUserProfile.maxAge || 100;

    queryBuilder.andWhere('profile.age >= :minAge', { minAge: userMinAge });
    queryBuilder.andWhere('profile.age <= :maxAge', { maxAge: userMaxAge });
  }

  private applyLocationFilter(
    queryBuilder: any,
    currentUserProfile: Profile,
    maxDistance: number
  ): void {
    // Using Haversine formula for distance calculation
    // This is a simplified version - in production, you'd use a proper geospatial database
    const lat = currentUserProfile.latitude;
    const lng = currentUserProfile.longitude;
    const radius = maxDistance; // in kilometers

    queryBuilder.andWhere(`
      (6371 * acos(cos(radians(:lat)) * cos(radians(profile.latitude)) * 
      cos(radians(profile.longitude) - radians(:lng)) + sin(radians(:lat)) * 
      sin(radians(profile.latitude)))) <= :maxDistance
    `, { lat, lng, maxDistance: radius });
  }

  private calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number | undefined {
    if (!lat1 || !lng1 || !lat2 || !lng2) {
      return undefined;
    }

    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private calculateMatchScore(
    currentUserProfile: Profile,
    candidateProfile: Profile
  ): number {
    let score = 0;

    // Tech stack compatibility (30% weight)
    if (currentUserProfile.techStack && candidateProfile.techStack) {
      const commonTech = currentUserProfile.techStack.filter(tech =>
        candidateProfile.techStack.includes(tech)
      );
      score += (commonTech.length / Math.max(currentUserProfile.techStack.length, 1)) * 30;
    }

    // Experience level compatibility (20% weight)
    if (currentUserProfile.experienceLevel && candidateProfile.experienceLevel) {
      if (currentUserProfile.experienceLevel === candidateProfile.experienceLevel) {
        score += 20;
      } else {
        // Partial points for close experience levels
        const levels = ['junior', 'mid', 'senior'];
        const currentIndex = levels.indexOf(currentUserProfile.experienceLevel);
        const candidateIndex = levels.indexOf(candidateProfile.experienceLevel);
        const diff = Math.abs(currentIndex - candidateIndex);
        score += Math.max(0, 20 - (diff * 10));
      }
    }

    // Location proximity (25% weight)
    if (currentUserProfile.latitude && candidateProfile.latitude) {
      const distance = this.calculateDistance(
        currentUserProfile.latitude,
        currentUserProfile.longitude,
        candidateProfile.latitude,
        candidateProfile.longitude
      ) || 0;
      
      if (distance < 10) score += 25; // Same city
      else if (distance < 50) score += 15; // Nearby
      else if (distance < 200) score += 5; // Same region
    }

    // Profile completeness (15% weight)
    if (candidateProfile.bio) score += 5;
    if (candidateProfile.githubUrl) score += 5;
    if (candidateProfile.linkedinUrl) score += 5;

    // Random factor for diversity (10% weight)
    score += Math.random() * 10;

    return Math.round(score);
  }
}

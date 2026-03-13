import { Injectable, NotFoundException } from '@nestjs/common';
import { Inject, forwardRef } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { UserRole } from '../enum/user-role.enum';
import { UserAction } from '../entities/user-action.entity';
import { MatchingService } from '../../matching/services/matching.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

     @InjectRepository(UserAction)
    private actionRepo: Repository<UserAction>,

    @Inject(forwardRef(() => MatchingService))
    private readonly matchingService: MatchingService,

  ) {}

  // 🔹 Generic create (used by scripts)
  async createUser(data: { email: string; password: string; name: string; role?: UserRole }): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
      name: data.name,
      role: data.role ?? UserRole.USER,
      isEmailVerified: false, // Default to false, will be set to true after OTP verification
    });

    return this.userRepository.save(user);
  }

  // 🔹 Update Email Verification Status
  async updateEmailVerification(userId: number, isVerified: boolean): Promise<void> {
    await this.userRepository.update(userId, { isEmailVerified: isVerified });
  }


  // 🔹 Find by Email (used by Auth)
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  // 🔹 Find by ID
  async findById(id: number): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  // 🔹 Find all (admin)
  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      relations: ['profile'],
    });
  }

  // 🔹 Delete user by ID (for scripts)
  async deleteById(id: number) {
    return this.userRepository.delete(id);
  }

  // 🔹 Validate Password
  async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }

  async browseUsers(currentUserId: number) {
    // Get users already acted upon
    const actions = await this.actionRepo.find({
      where: { fromUser: { id: currentUserId } },
      relations: ['toUser'],
    });

    const excludedUserIds = actions.map(a => a.toUser.id);
    excludedUserIds.push(currentUserId);

    return this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profile', 'profile')
      .where('user.id NOT IN (:...excluded)', { excluded: excludedUserIds })
      .andWhere('profile.isComplete = true')
      .getMany();
  }

  async discoverUsers(userId: number) {

  const swipedUserIds =
    await this.matchingService.getSwipedUserIds(userId);

  const matchedUserIds =
    await this.matchingService.getMatchedUserIds(userId);

  const excludedIds = [
    userId,
    ...swipedUserIds,
    ...matchedUserIds,
  ];

  const users = await this.userRepository.find({
    where: {
      id: Not(In(excludedIds)),
    },
    take: 20,
  });

  return users;
}
}

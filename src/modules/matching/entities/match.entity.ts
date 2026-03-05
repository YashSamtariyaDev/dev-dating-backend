import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  Unique,
  Index,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('matches')
@Unique(['user1', 'user2'])
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user1Id' })
  user1: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user2Id' })
  user2: User;

  @CreateDateColumn()
  matchedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}

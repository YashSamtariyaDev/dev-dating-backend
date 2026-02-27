import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Column,
  Unique,
  Index,
} from 'typeorm';
import { User } from '../../users/user.entity';

@Entity('matches')
@Unique(['user1', 'user2'])
export class Match {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Index()
  user1: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Index()
  user2: User;

  @CreateDateColumn()
  matchedAt: Date;

  @Column({ default: true })
  isActive: boolean;
}
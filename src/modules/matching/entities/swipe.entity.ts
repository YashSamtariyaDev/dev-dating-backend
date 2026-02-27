import { User } from '../../users/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  Unique,
  Index,
} from 'typeorm';

export enum SwipeType {
  LIKE = 'LIKE',
  PASS = 'PASS',
  SUPER_LIKE = 'SUPER_LIKE',
}

@Entity('swipes')
@Unique(['swiper', 'target'])
export class Swipe {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Index()
  swiper: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @Index()
  target: User;

  @Column({
    type: 'enum',
    enum: SwipeType,
  })
  type: SwipeType;

  @CreateDateColumn()
  createdAt: Date;
}
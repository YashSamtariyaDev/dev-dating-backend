import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../user.entity';

export enum UserActionType {
  LIKE = 'LIKE',
  DISLIKE = 'DISLIKE',
}

@Entity('user_actions')
export class UserAction {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  fromUser: User;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  toUser: User;

  @Column({ type: 'enum', enum: UserActionType })
  action: UserActionType;

  @CreateDateColumn()
  createdAt: Date;
}

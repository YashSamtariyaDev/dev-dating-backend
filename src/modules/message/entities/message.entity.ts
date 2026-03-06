import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('messages')
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'chat_room_id' })
  chatRoomId: number;

  @Column({ name: 'sender_id' })
  senderId: number;

  @Column({ name: 'message' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;
}
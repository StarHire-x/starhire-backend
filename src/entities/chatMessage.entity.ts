import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Chat } from './chat.entity';

@Entity()
export class ChatMessage {
  @PrimaryGeneratedColumn()
  chatMessageId: number;

  @Column()
  message: string;

  @CreateDateColumn()
  timestamp: Date;

  @ManyToOne(() => Chat, (chat) => chat.chatMessages) // Establish many-to-one relationship
  chat: Chat;
}
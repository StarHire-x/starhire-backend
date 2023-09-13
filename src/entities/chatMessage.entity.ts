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

  @Column()
  isImportant: boolean;

  @Column()
  userId: number;

  @Column()
  fileURL: string;

  @ManyToOne(() => Chat, (chat) => chat.chatMessages) // Establish many-to-one relationship
  chat: Chat;

  constructor(entity: Partial<ChatMessage>) {
    Object.assign(this, entity);
  }
}

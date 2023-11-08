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
  userId: string;

  @Column()
  fileURL: string;

  @ManyToOne(() => Chat, (chat) => chat.chatMessages)
  chat: Chat;

  constructor(entity: Partial<ChatMessage>) {
    Object.assign(this, entity);
  }
}

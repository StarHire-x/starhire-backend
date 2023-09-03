import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { ChatMessage } from './chatMessage.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  chatId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdatedAt: Date;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chat) // Establish one-to-many relationship
  chatMessages: ChatMessage[];
}

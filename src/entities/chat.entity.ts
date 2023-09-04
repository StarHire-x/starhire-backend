import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { ChatMessage } from './chatMessage.entity';
import { JobSeeker } from './jobSeeker.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  chatId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdatedAt: Date;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chat) // Establish one-to-many relationship
  chatMessages: ChatMessage[];

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.chats, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;

  constructor(entity: Partial<Chat>) {
    Object.assign(this, entity);
  }
}

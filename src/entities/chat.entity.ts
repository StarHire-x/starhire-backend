import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ChatMessage } from './chatMessage.entity';
import { JobSeeker } from './jobSeeker.entity';
import { Corporate } from './corporate.entity';
import { Recruiter } from './recruiter.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  chatId: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  lastUpdatedAt: Date;

  @OneToMany(() => ChatMessage, (chatMessage) => chatMessage.chat)// Establish one-to-many relationship
  chatMessages: ChatMessage[];

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.chats, {
    nullable: true,
    eager: true
  })
  jobSeeker: JobSeeker;

  @ManyToOne(() => Corporate, (corporate) => corporate.chats, {
    nullable: true,
    eager: true
  })
  corporate: Corporate;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.chats, {
    nullable: true,
    eager: true
  })
  recruiter: Recruiter;

  constructor(entity: Partial<Chat>) {
    Object.assign(this, entity);
  }
}

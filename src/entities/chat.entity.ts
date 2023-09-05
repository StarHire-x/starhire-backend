import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ChatMessage } from './chatMessage.entity';
import { JobSeeker } from './jobSeeker.entity';
import { Recruiter } from './recruiter.entity';
import { Corporate } from './corporate.entity';

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

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.userId, {
    //onDelete: 'CASCADE',
  })
  recruiter: Recruiter;

  @ManyToOne(() => Corporate, (corporate) => corporate.userId, {
    //onDelete: 'CASCADE',
  })
  corporate: Corporate;

  constructor(entity: Partial<Chat>) {
    Object.assign(this, entity);
  }
}

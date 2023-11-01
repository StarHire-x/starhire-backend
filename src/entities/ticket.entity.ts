import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
} from 'typeorm';
import { IsEnum } from 'class-validator';
import TicketCategoryEnum from '../enums/ticketCategory.enum';
import { Administrator } from './administrator.entity';
import { Corporate } from './corporate.entity';
import { Recruiter } from './recruiter.entity';
import { JobSeeker } from './jobSeeker.entity';
import { Document } from './document.entity';
import { ForumPost } from './forumPost.entity';

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn()
  ticketId: number;

  @Column()
  ticketName: string;

  @Column()
  ticketDescription: string;

  @Column()
  isResolved: boolean;

  @Column()
  email: string;

  @CreateDateColumn() // Automatically sets the current date and time
  submissionDate: Date;

  @OneToMany(() => Document, (document) => document.ticket, {
    cascade: true,
    nullable: true,
  })
  documents: Document[];

  @Column()
  @IsEnum(TicketCategoryEnum)
  ticketCategory: TicketCategoryEnum;

  @ManyToOne(() => Administrator, (administrator) => administrator.tickets)
  administrator: Administrator;

  @ManyToOne(() => Corporate, (corporate) => corporate.tickets)
  corporate: Corporate;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.tickets)
  recruiter: Recruiter;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.tickets)
  jobSeeker: JobSeeker;

  constructor(entity: Partial<Ticket>) {
    Object.assign(this, entity);
  }
}

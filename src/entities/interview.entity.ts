// interview.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JobSeeker } from './jobSeeker.entity';
import { Corporate } from './corporate.entity';
import { Recruiter } from './recruiter.entity';
import { JobApplication } from './jobApplication.entity';
import InterviewStatusEnum from 'src/enums/InterviewStatus.enum';

@Entity()
export class Interview {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text', { array: true, default: [] })
  chosenDates: Date[];

  @Column({ type: 'datetime' })
  scheduledDate: Date;

  @Column({ default: 'empty' })
  interviewLink: string;

  @Column({ default: 'PENDING' })
  status: string;

  @Column()
  interviewStatus: InterviewStatusEnum;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.interviews)
  @JoinColumn()
  jobSeeker: JobSeeker;

  @ManyToOne(() => Corporate, (corporate) => corporate.interviews, {
    nullable: false,
  })
  @JoinColumn()
  corporate: Corporate;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.interviews)
  @JoinColumn()
  recruiter: Recruiter;

  @ManyToOne(
    () => JobApplication,
    (jobApplication) => jobApplication.interviews,
    { nullable: false },
  )
  @JoinColumn()
  jobApplication: JobApplication;
}

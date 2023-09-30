import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from './document.entity';
import { JobListing } from './jobListing.entity';
import { JobSeeker } from './jobSeeker.entity';
import { Commission } from './commission.entity';
import { Recruiter } from './recruiter.entity';

@Entity({ name: 'jobApplications' })
export class JobApplication {
  @PrimaryGeneratedColumn()
  jobApplicationId: number;

  @Column()
  jobApplicationStatus: JobApplicationStatusEnum;

  @Column()
  availableStartDate: Date;

  @Column({ nullable: true })
  availableEndDate: Date;

  @Column({
    type: 'varchar',
    length: 2000,
    nullable: true,
  })
  remarks: string;

  @Column({ nullable: true })
  submissionDate: Date;

  @OneToMany(() => Document, (document) => document.jobApplication, {
    cascade: true,
    nullable: true,
  })
  documents: Document[];

  @ManyToOne(() => JobListing, (jobListing) => jobListing.jobApplications)
  jobListing: JobListing;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.jobApplications)
  jobSeeker: JobSeeker;

  @OneToOne(() => Commission, (commission) => commission.jobApplication, {
    nullable: true,
  })
  @JoinColumn()
  commission: Commission;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.jobApplications)
  recruiter: Recruiter;

  constructor(entity: Partial<JobApplication>) {
    Object.assign(this, entity);
  }
}

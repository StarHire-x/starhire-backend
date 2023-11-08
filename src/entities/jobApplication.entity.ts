import JobApplicationStatusEnum from '../enums/jobApplicationStatus.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from './document.entity';
import { JobListing } from './jobListing.entity';
import { JobSeeker } from './jobSeeker.entity';
import { Commission } from './commission.entity';
import { Recruiter } from './recruiter.entity';
import { Invoice } from './invoice.entity';

@Entity({ name: 'jobApplications' })
export class JobApplication {
  @PrimaryGeneratedColumn()
  jobApplicationId: number;

  @Column()
  jobApplicationStatus: JobApplicationStatusEnum;

  @Column({ nullable: true })
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

  @ManyToOne(() => Commission, (commission) => commission.jobApplications, {
    nullable: true,
  })
  commission: Commission;

  @ManyToOne(() => Recruiter, (recruiter) => recruiter.jobApplications)
  recruiter: Recruiter;

  @ManyToOne(() => Invoice, (invoice) => invoice.jobApplications, {
    nullable: true,
  })
  invoice: Invoice;

  constructor(entity: Partial<JobApplication>) {
    Object.assign(this, entity);
  }
}

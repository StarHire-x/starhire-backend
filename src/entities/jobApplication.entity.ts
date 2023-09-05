import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Document } from './document.entity';
import { JobListing } from './jobListing.entity';
import { JobSeeker } from './jobSeeker.entity';
import { Commission } from './commission.entity';

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

  @OneToMany(() => Document, (document) => document.jobApplication, {
    cascade: true,
  })
  documents: Document[];

  @Column({ nullable: true })
  submissionDate: Date;

  @ManyToOne(() => JobListing, (jobListing) => jobListing.jobApplications, {
    onDelete: 'CASCADE',
  })
  jobListing: JobListing;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.jobApplications, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;

  @OneToOne(() => Commission, (commission) => commission.jobApplication, {
    nullable: true,
  })
  commission: Commission;

  constructor(entity: Partial<JobApplication>) {
    Object.assign(this, entity);
  }
}

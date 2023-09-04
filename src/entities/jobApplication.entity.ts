import { IsEnum } from 'class-validator';
import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Document } from './document.entity';
import { JobListing } from './job-listing.entity';

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

  constructor(entity: Partial<JobApplication>) {
    Object.assign(this, entity);
  }

  @OneToMany(() => JobListing, (jobListing) => jobListing.jobApplication, {
    cascade: true,
  })
  jobListings: JobListing[];
}

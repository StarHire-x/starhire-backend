import JobListingStatusEnum from '../enums/jobListingStatus.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobApplication } from './jobApplication.entity';
import { Corporate } from './corporate.entity';
import { JobSeeker } from './jobSeeker.entity';
import { SavedJobListing } from './savedJobListing.entity';

@Entity({ name: 'jobListings' })
export class JobListing {
  @PrimaryGeneratedColumn()
  jobListingId: number;

  @Column()
  title: string;

  @Column('varchar', { length: 3000 })
  description: string;

  @Column('varchar', { length: 4000 })
  experienceRequired: string;

  @Column()
  address: string;

  @Column()
  postalCode: string;

  @CreateDateColumn()
  listingDate: Date;

  @Column()
  jobStartDate: Date;

  @Column()
  jobListingStatus: JobListingStatusEnum;

  @Column()
  payRange: string;

  @Column()
  jobType: string;

  @Column()
  schedule: string;

  @Column()
  supplementalPay: string;

  @Column()
  otherBenefits: string;

  @Column()
  certificationsRequired: string;

  @Column()
  typeOfWorkers: string;

  @Column()
  requiredLanguages: string;

  @Column()
  otherConsiderations: string;

  @ManyToOne(() => Corporate, (corporate) => corporate.jobListings, {
    nullable: false,
  })
  corporate: Corporate;

  @OneToMany(
    () => JobApplication,
    (jobApplication) => jobApplication.jobListing,
    {
      cascade: true,
      nullable: true,
    },
  )
  jobApplications: JobApplication[];

  @ManyToMany(() => JobSeeker, (jobSeeker) => jobSeeker.jobListings, {
    nullable: true, // optional
  })
  @JoinTable({ name: 'jobseeker_joblistings' })
  jobSeekers: JobSeeker[];

  @OneToMany(
    () => SavedJobListing,
    (savedJobListing) => savedJobListing.jobListing,
    {
      cascade: true,
      nullable: true,
    },
  )
  savedBy: SavedJobListing[];

  constructor(entity: Partial<JobListing>) {
    Object.assign(this, entity);
  }
}

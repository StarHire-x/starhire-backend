import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';
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

@Entity({ name: 'jobListings' })
export class JobListing {
  @PrimaryGeneratedColumn()
  jobListingId: number;

  @Column()
  title: string;

  @Column('varchar', { length: 5000 })
  overview: string;

  @Column('varchar', { length: 5000 })
  responsibilities: string;

  @Column('varchar', { length: 5000 })
  requirements: string;

  @Column()
  jobLocation: string;

  @CreateDateColumn()
  listingDate: Date;

  @Column()
  averageSalary: number;

  @Column()
  jobStartDate: Date;

  @Column()
  jobListingStatus: JobListingStatusEnum;

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
    nullable: true,
  })
  @JoinTable()
  jobSeekers: JobSeeker[];

  constructor(entity: Partial<JobListing>) {
    Object.assign(this, entity);
  }
}

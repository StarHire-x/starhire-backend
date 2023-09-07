import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';
import { Corporate } from 'src/entities/corporate.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobApplication } from './jobApplication.entity';

@Entity({ name: 'jobListings' })
export class JobListing {
  @PrimaryGeneratedColumn()
  jobListingId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  jobLocation: string;

  @Column()
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

  constructor(entity: Partial<JobListing>) {
    Object.assign(this, entity);
  }
}

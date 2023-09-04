import { IsEnum } from 'class-validator';
import JobListingStatuEnum from 'src/enums/jobListingStatus.enum';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
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
  jobListingStatus: JobListingStatuEnum;

  @ManyToOne(
    () => JobApplication,
    (jobApplication) => jobApplication.jobListings,
    { onDelete: 'CASCADE' },
  )
  jobApplication: JobApplication;

  constructor(entity: Partial<JobListing>) {
    Object.assign(this, entity);
  }
}

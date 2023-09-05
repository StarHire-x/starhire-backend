import { IsEnum } from 'class-validator';
import JobListingStatuEnum from 'src/enums/jobListingStatus.enum';
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { JobApplication } from './jobApplication.entity';
import { Corporate } from './corporate.entity';

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

  @OneToMany(() => JobApplication, (jobApplication) => jobApplication.jobListing, {
    cascade: true,
  })
  jobApplications: JobApplication[];

  @ManyToOne(() => Corporate, (corporate) => corporate.jobListings, {
    onDelete: 'CASCADE'
  })
  corporate: Corporate;

  constructor(entity: Partial<JobListing>) {
    Object.assign(this, entity);
  }
}

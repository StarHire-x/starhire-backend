import { IsEnum } from 'class-validator';
import jobListingStatuEnum from 'src/enums/jobListingStatus.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @IsEnum(jobListingStatuEnum)
  jobListingStatus: jobListingStatuEnum;

  constructor(entity: Partial<JobListing>) {
    Object.assign(this, entity);
  }
}

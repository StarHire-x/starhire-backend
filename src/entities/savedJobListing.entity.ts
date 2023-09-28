import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobListing } from './jobListing.entity';
import { JobSeeker } from './jobSeeker.entity';

@Entity({ name: 'savedJobListings' })
export class SavedJobListing {
  @PrimaryGeneratedColumn()
  savedJobListingId: number;

  @CreateDateColumn()
  savedOn: Date;

  @ManyToOne(() => JobListing, (jobListing) => jobListing.savedBy)
  jobListing: JobListing;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.savedJobListings)
  jobSeeker: JobSeeker;

  constructor(entity?: Partial<SavedJobListing>) {
    Object.assign(this, entity);
  }
}

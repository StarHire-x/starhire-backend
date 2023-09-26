import { Entity, JoinColumn, ManyToOne, PrimaryColumn } from "typeorm";
import { JobListing } from "./jobListing.entity";
import { JobSeeker } from "./jobSeeker.entity";

@Entity('jobListing_jobSeeker')
export class JobListingJobSeeker {
  @PrimaryColumn()
  jobListingId: number;

  @PrimaryColumn()
  jobSeekerId: number;

  @ManyToOne(
    () => JobListing,
    jobListing => jobListing.jobSeekers,
  )
  @JoinColumn([{ name: 'jobListingId', referencedColumnName: 'jobListingId' }])
  jobListings: JobListing[];

  @ManyToOne(
    () => JobSeeker,
    jobSeeker => jobSeeker.jobListings,
  )
  @JoinColumn([{ name: 'userId', referencedColumnName: 'userId' }])
  jobSeekers: JobSeeker[];
}
import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';

export class CreateJobListingDto {
  corporateId: number; // Parent relationship
  jobListingId: number;
  title: string;
  jobLocation: string;
  description: string;
  listingDate: Date;
  averageSalary: number;
  jobStartDate: Date;
  jobListingStatus: JobListingStatusEnum;
}

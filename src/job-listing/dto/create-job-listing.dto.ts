import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';

export class CreateJobListingDto {
  title: string;
  jobLocation: string;
  description: string;
  listingDate: Date;
  averageSalary: number;
  jobStartDate: Date;
  jobListingStatus: JobListingStatusEnum;
  corporateId: string; // Parent relationship
}

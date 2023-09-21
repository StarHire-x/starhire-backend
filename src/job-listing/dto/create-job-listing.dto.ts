import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';

export class CreateJobListingDto {
  title: string;
  overview: string;
  responsibilities: string;
  requirements: string;
  jobLocation: string;
  listingDate: Date;
  averageSalary: number;
  jobStartDate: Date;
  jobListingStatus: JobListingStatusEnum;
  corporateId: string; // Parent relationship
}

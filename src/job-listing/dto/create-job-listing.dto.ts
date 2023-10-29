import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';

export class CreateJobListingDto {
  title: string;
  overview: string;
  responsibilities: string;
  requirements: string;
  requiredDocuments: string;
  jobLocation: string;
  listingDate: Date;
  averageSalary: number;
  jobStartDate: Date;
  payRange: string;
  jobType: string;
  schedule: string;
  supplementalPay: string;
  otherBenefits: string;
  certificationsRequired: string;
  typeOfWorkers: string;
  requiredLanguages: string;
  otherConsiderations: string;
  jobListingStatus: JobListingStatusEnum;
  corporateId: string; // Parent relationship
}

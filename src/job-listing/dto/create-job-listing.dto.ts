import JobListingStatusEnum from '../../enums/jobListingStatus.enum';

export class CreateJobListingDto {
  title: string;
  description: string;
  experienceRequired: string;
  address: string;
  postalCode: string;
  listingDate: Date;
  jobStartDate: Date;
  jobListingStatus: JobListingStatusEnum;
  payRange: string;
  jobType: string;
  schedule: string;
  supplementalPay: string;
  otherBenefits: string;
  certificationsRequired: string;
  typeOfWorkers: string;
  requiredLanguages: string;
  otherConsiderations: string;
  corporateId: string; // Parent relationship
}

import { PartialType } from '@nestjs/mapped-types';
import { Recruiter } from '../../entities/recruiter.entity';
import JobListingStatusEnum from '../../enums/jobListingStatus.enum';

class UpdateDto {
  title: string;
  overview: string;
  responsibilities: string;
  requirements: string;
  requiredDocuments: string;
  jobLocation: string;
  listingDate: Date;
  averageSalary: number;
  jobStartDate: Date;
  jobListingStatus: JobListingStatusEnum;
  jobSeekers: [];
}

export class UpdateJobListingDto extends PartialType(UpdateDto) {}

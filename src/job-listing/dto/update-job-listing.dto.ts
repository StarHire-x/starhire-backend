import { PartialType } from '@nestjs/mapped-types';
import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';

class UpdateDto {
  title: string;
  overview: string;
  responsibilities: string;
  requirements: string;
  jobLocation: string;
  listingDate: Date;
  averageSalary: number;
  jobStartDate: Date;
  jobListingStatus: JobListingStatusEnum;
  jobSeekers: [];
}

export class UpdateJobListingDto extends PartialType(UpdateDto) {}

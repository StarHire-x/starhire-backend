import { PartialType } from '@nestjs/mapped-types';
import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';

class UpdateDto {
  title: string;
  description: string;
  jobLocation: string;
  listingDate: Date;
  averageSalary: number;
  jobStartDate: Date;
  jobListingStatus: JobListingStatusEnum;
}

export class UpdateJobListingDto extends PartialType(UpdateDto) {}

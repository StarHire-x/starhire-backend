import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';

export class CreateJobApplicationDto {
  jobApplicationId: number;
  jobApplicationStatus: JobApplicationStatusEnum;
  availableStartDate: Date;
  availableEndDate: Date;
  submissionDate: Date;
  jobListingId: number;
  jobSeekerId: number;
  recruiterId: number;
}

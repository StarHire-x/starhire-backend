import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';

export class CreateJobApplicationDto {
  jobApplicationStatus: JobApplicationStatusEnum;
  availableStartDate: Date;
  availableEndDate: Date;
  submissionDate: Date;
  // Parent entities
  jobListingId: number;
  jobSeekerId: number;
  recruiterId: number;
}

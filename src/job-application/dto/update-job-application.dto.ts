import { PartialType } from '@nestjs/mapped-types';
import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';

class UpdateDto {
  jobApplicationStatus: JobApplicationStatusEnum;
  availableStartDate: Date;
  availableEndDate: Date;
  submissionDate: Date;
  documents: Document[];
}

export class UpdateJobApplicationDto extends PartialType(UpdateDto) {}

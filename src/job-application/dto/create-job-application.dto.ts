import { CreateDocumentDto } from 'src/document/dto/create-document.dto';
import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';

export class CreateJobApplicationDto {
  jobApplicationStatus: JobApplicationStatusEnum;
  availableStartDate: Date;
  availableEndDate: Date;
  remarks: string;
  submissionDate: Date;
  // Parent entities
  jobListingId: number;
  jobSeekerId: string;
  recruiterId: string;
  documents: CreateDocumentDto[];
}

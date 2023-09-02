import { CreateDocumentDto } from "src/document/dto/create-document.dto";
import JobApplicationStatusEnum from "src/enums/jobApplicationStatus.enum";

export class CreateJobApplicationDto {
  jobApplicationId: number;
  jobApplicationStatus: JobApplicationStatusEnum;
  availableStartDate: Date;
  availableEndDate: Date;
  documents: CreateDocumentDto[];
  submissionDate: Date;
}

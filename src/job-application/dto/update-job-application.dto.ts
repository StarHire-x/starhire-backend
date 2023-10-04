import { PartialType } from '@nestjs/mapped-types';
import { UpdateDocumentDto } from 'src/document/dto/update-document.dto';
import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';

class UpdateDto {
  jobApplicationStatus: JobApplicationStatusEnum;
  availableStartDate: Date;
  availableEndDate: Date;
  remarks: string;
  submissionDate: Date;
  documents: UpdateDocumentDto[];
}

export class UpdateJobApplicationDto extends PartialType(UpdateDto) {}

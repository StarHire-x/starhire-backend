import { PartialType } from '@nestjs/mapped-types';
import { UpdateDocumentDto } from '../../document/dto/update-document.dto';
import JobApplicationStatusEnum from '../../enums/jobApplicationStatus.enum';

class UpdateDto {
  jobApplicationStatus: JobApplicationStatusEnum;
  availableStartDate: Date;
  availableEndDate: Date;
  remarks: string;
  submissionDate: Date;
  documents: UpdateDocumentDto[];
}

export class UpdateJobApplicationDto extends PartialType(UpdateDto) {}

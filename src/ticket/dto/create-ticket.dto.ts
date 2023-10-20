import { CreateDocumentDto } from 'src/document/dto/create-document.dto';
import TicketCategoryEnum from 'src/enums/ticketCategory.enum';

export class CreateTicketDto {
  corporateId: string; // parent relationship
  adminId: string; // parent relationship
  recruiterId: string; // parent relationship
  jobSeekerId: string; // parent relationship
  documents: CreateDocumentDto[];
  ticketName: string;
  ticketDescription: string;
  isResolved: boolean;
  email: string;
  submissionDate: Date;
  ticketCategory: TicketCategoryEnum;
}

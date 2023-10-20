import { PartialType } from '@nestjs/mapped-types';
import { UpdateDocumentDto } from 'src/document/dto/update-document.dto';
import TicketCategoryEnum from 'src/enums/ticketCategory.enum';

class UpdateDto {
  adminId: string; // can update adminId once admin picks up this ticket, initially will be null upon ticket creation
  ticketName: string;
  ticketDescription: string;
  isResolved: boolean;
  email: string;
  submissionDate: Date;
  ticketCategory: TicketCategoryEnum;
  documents: UpdateDocumentDto[];
}

export class UpdateTicketDto extends PartialType(UpdateDto) {}

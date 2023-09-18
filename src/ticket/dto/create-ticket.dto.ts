import TicketCategoryEnum from 'src/enums/ticketCategory.enum';

export class CreateTicketDto {
  corporateId: string; // parent relationship
  adminId: string; // parent relationship
  recruiterId: string; // parent relationship
  jobSeekerId: string; // parent relationship
  ticketName: string;
  ticketDescription: string;
  isResolved: boolean;
  submissionDate: Date;
  ticketCategory: TicketCategoryEnum;
}

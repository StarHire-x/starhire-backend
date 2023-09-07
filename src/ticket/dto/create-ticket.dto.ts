import TicketCategoryEnum from "src/enums/ticketCategory.enum";

export class CreateTicketDto {
  corporateId: number; // parent relationship
  adminId: number; // parent relationship
  recruiterId: number; // parent relationship
  jobSeekerId: number; // parent relationship
  ticketName: string;
  ticketDescription: string;
  isResolved: boolean;
  submissionDate: Date;
  ticketCategory: TicketCategoryEnum;
}
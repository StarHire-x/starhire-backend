import TicketCategoryEnum from "src/enums/ticketCategory.enum";

export class CreateTicketDto {
  ticketName: string;
  ticketDescription: string;
  isResolved: boolean;
  submissionDate: Date;
  ticketCategory: TicketCategoryEnum;
}
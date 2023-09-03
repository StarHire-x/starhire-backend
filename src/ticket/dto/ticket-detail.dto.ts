import TicketCategoryEnum from "src/enums/ticketCategory.enum";

export class TicketDetailDto {
  ticketName: string;
  ticketDescription: string;
  isResolved: boolean;
  submissionDate: Date;
  ticketCategory: TicketCategoryEnum;
}
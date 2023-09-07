import { PartialType } from '@nestjs/mapped-types';
import TicketCategoryEnum from 'src/enums/ticketCategory.enum';

class UpdateDto {
    adminId: number; // can update adminId once admin picks up this ticket, initially will be null upon ticket creation
    ticketName: string;
    ticketDescription: string;
    isResolved: boolean;
    submissionDate: Date;
    ticketCategory: TicketCategoryEnum;
}

export class UpdateTicketDto extends PartialType(UpdateDto) {}

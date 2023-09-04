import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEnum } from 'class-validator';
import TicketCategoryEnum from 'src/enums/ticketCategory.enum';

@Entity({ name: 'tickets' })
export class Ticket {
  @PrimaryGeneratedColumn()
  ticketId: number;

  @Column()
  ticketName: string;

  @Column()
  ticketDescription: string;

  @Column()
  isResolved: boolean;

  @Column()
  submissionDate: Date;

  @Column()
  @IsEnum(TicketCategoryEnum)
  ticketCategory: TicketCategoryEnum;

  constructor(entity: Partial<Ticket>) {
    Object.assign(this, entity);
  }
}

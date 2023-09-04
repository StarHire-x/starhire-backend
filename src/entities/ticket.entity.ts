import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { IsEnum } from 'class-validator';
import TicketCategoryEnum from 'src/enums/ticketCategory.enum';
import { Administrator } from './administrator.entity';

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

  @ManyToOne(
    () => Administrator,
    (administrator) => administrator.tickets,
    {  onDelete: 'CASCADE' },
  )
  administrator: Administrator;

  constructor(entity: Partial<Ticket>) {
    Object.assign(this, entity);
  }
}

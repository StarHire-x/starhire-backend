import {
  Column,
  Entity,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';
import { Invoice } from './invoice.entity';
import { Commission } from './commission.entity';

@Entity({ name: 'administrators' })
export class Administrator extends User {
  @OneToMany(() => Ticket, (ticket) => ticket.administrator, {
    cascade: true,
  })
  tickets: Ticket[];

  @Column()
  fullName: string;

  @Column()
  profilePictureUrl: string;

  @OneToMany(() => Invoice, (invoice) => invoice.administrator, {
    nullable: true,
  })
  invoices: Invoice[];

  @OneToMany(() => Commission, (commission) => commission.administrator, {
    nullable: true,
  })
  commissions: Commission[];

  constructor(entity: Partial<Administrator>) {
    super(entity);
    Object.assign(this, entity);
  }
}

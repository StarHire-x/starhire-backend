import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  EntityManager,
  OneToMany,
} from 'typeorm';
import { IsEnum } from 'class-validator';
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

  constructor(entity: Partial<User>) {
    super(entity);
  }
}

import { Column, Entity, PrimaryGeneratedColumn, EntityManager, OneToMany } from 'typeorm';
import { IsEnum } from 'class-validator';
import { User } from './user.entity';
import { Ticket } from './ticket.entity';

@Entity({ name: 'administrators' })
export class Administrator extends User {
  @OneToMany(() => Ticket, (ticket) => ticket.administrator, {
    cascade: true,
  })
  tickets: Ticket[];
  constructor(entity: Partial<User>) {
    super(entity);
  }
}

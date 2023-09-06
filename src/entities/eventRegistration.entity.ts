import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { EventListing } from './eventListing.entity';

@Entity({ name: 'eventRegistrations' })
export class EventRegistration {
  @PrimaryGeneratedColumn()
  eventRegistrationId: number;

  @Column()
  isActive: boolean;

  @ManyToOne(
    () => EventListing,
    (eventListing) => eventListing.eventRegistrations,
    { onDelete: 'CASCADE' },
  )
  eventListing: EventListing;

  constructor(entity: Partial<EventRegistration>) {
    Object.assign(this, entity);
  }
}

import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { EventRegistration } from './eventRegistration.entity';
import { Corporate } from './corporate.entity';

@Entity({ name: 'eventListings' })
export class EventListing {
  @PrimaryGeneratedColumn()
  eventListingId: number;

  @Column()
  eventName: string;

  @Column()
  location: string;

  @Column()
  dateAndTime: Date;

  @Column()
  description: string;

  @Column()
  image: string;

  @OneToMany(
    () => EventRegistration,
    (eventRegistration) => eventRegistration.eventListing,
    {
      cascade: true,
    },
  )
  eventRegistrations: EventRegistration[];

  @ManyToOne(() => Corporate, (corporate) => corporate.eventListings, {
    onDelete: 'CASCADE',
  })
  corporate: Corporate;

  constructor(entity: Partial<EventListing>) {
    Object.assign(this, entity);
  }
}

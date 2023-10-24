import EventListingStatusEnum from 'src/enums/eventListingStatus.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  CreateDateColumn,
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
  eventDate: Date;

  @Column('varchar', { length: 4000 })
  details: string;

  @Column()
  image: string;

  @CreateDateColumn()
  listingDate: Date;

  @Column()
  eventListingStatus: EventListingStatusEnum;

  @OneToMany(
    () => EventRegistration,
    (eventRegistration) => eventRegistration.eventListing,
    {
      cascade: true,
      nullable: true,
    },
  )
  eventRegistrations: EventRegistration[];

  @ManyToOne(() => Corporate, (corporate) => corporate.eventListings, {
    nullable: false,
  })
  corporate: Corporate;

  constructor(entity: Partial<EventListing>) {
    Object.assign(this, entity);
  }
}

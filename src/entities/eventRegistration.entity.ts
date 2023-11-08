import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { EventListing } from './eventListing.entity';
import { JobSeeker } from './jobSeeker.entity';

@Entity({ name: 'eventRegistrations' })
export class EventRegistration {
  @PrimaryGeneratedColumn()
  eventRegistrationId: number;

  @Column({ nullable: true })
  registrationDate: Date;

  @ManyToOne(
    () => EventListing,
    (eventListing) => eventListing.eventRegistrations,
  )
  eventListing: EventListing;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.eventRegistrations)
  jobSeeker: JobSeeker;

  constructor(entity: Partial<EventRegistration>) {
    Object.assign(this, entity);
  }
}

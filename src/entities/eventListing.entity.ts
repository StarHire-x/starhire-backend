import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { EventRegistration } from './eventRegistration.entity';

@Entity({name: 'eventListings'})
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

    @OneToMany(() => EventRegistration, (eventRegistration) => eventRegistration.eventListing, {
        cascade: true,
      })
      eventRegistrations: EventRegistration[];

    constructor(entity: Partial<EventListing>) {
        Object.assign(this, entity);
    }   
}

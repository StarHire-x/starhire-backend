import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    constructor(entity: Partial<EventListing>) {
        Object.assign(this, entity);
    }   
}

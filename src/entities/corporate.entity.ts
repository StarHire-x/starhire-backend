import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { EventListing } from './eventListing.entity';

@Entity({ name: 'corporates' })
export class Corporate extends User {
  constructor(entity: Partial<User>) {
    super(entity);
  }

  @Column()
  companyName: string;

  @Column({ unique: true })
  companyRegistrationId: number;

  @Column()
  corporatePicture: string;

  @Column()
  companyAddress: string;

  @OneToMany(() => EventListing, (eventListing) => eventListing.corporate, {
    cascade: true,
  })
  eventListings: EventListing[];
}
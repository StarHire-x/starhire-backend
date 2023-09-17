import { Column, Entity, OneToMany } from 'typeorm';
import { User } from './user.entity';
import { EventListing } from './eventListing.entity';
import { JobListing } from './jobListing.entity';
import { Chat } from './chat.entity';
import { Ticket } from './ticket.entity';
import { Review } from './review.entity';

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
  profilePictureUrl: string;

  @Column()
  companyAddress: string;

  @OneToMany(() => EventListing, (eventListing) => eventListing.corporate, {
    cascade: true,
  })
  eventListings: EventListing[];

  @OneToMany(() => JobListing, (jobListing) => jobListing.corporate, {
    cascade: true,
  })
  jobListings: JobListing[];

  @OneToMany(() => Chat, (chat) => chat.corporate, {
    cascade: true,
  })
  chats: Chat[];

  @OneToMany(() => Ticket, (ticket) => ticket.corporate, {
    cascade: true,
  })
  tickets: Ticket[];

  // TODO: Relationship with Review entity
  @OneToMany(() => Review, (review) => review.corporate)
  reviews: Review[];
}

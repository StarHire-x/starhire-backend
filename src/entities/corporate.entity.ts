import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { EventListing } from './eventListing.entity';
import { JobListing } from './jobListing.entity';
import { Chat } from './chat.entity';
import { Ticket } from './ticket.entity';
import { Review } from './review.entity';
import { JobSeeker } from './jobSeeker.entity';
import { JobPreference } from './jobPreference.entity';
import { Invoice } from './invoice.entity';
import CorporatePromotionStatusEnum from '../enums/corporatePromotionStatus.enum';
import { IsEnum } from 'class-validator';
//import { Interview } from './interview.entity';

@Entity({ name: 'corporates' })
export class Corporate extends User {
  constructor(entity: Partial<Corporate>) {
    super(entity);
    Object.assign(this, entity);
  }

  @Column()
  companyName: string;

  @Column()
  schoolCategory: string;

  @Column()
  companyRegistrationId: number;

  @Column()
  profilePictureUrl: string;

  @Column()
  companyAddress: string;

  @Column()
  postalCode: string;

  @Column()
  regions: string;

  @Column({
    type: 'enum',
    enum: CorporatePromotionStatusEnum,
    default: CorporatePromotionStatusEnum.REGULAR,
  })
  @IsEnum(CorporatePromotionStatusEnum)
  corporatePromotionStatus: CorporatePromotionStatusEnum;

  @Column()
  stripeSubId: string;

  @Column()
  stripeCustId: string;

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

  @OneToOne(() => JobPreference, (preference) => preference.corporate, {
    cascade: true,
    nullable: true, // one-to-one optional
  })
  jobPreference: JobPreference;

  // TODO: Relationship with Review entity
  @OneToMany(() => Review, (review) => review.corporate)
  reviews: Review[];

  @ManyToMany(() => JobSeeker, (jobSeeker) => jobSeeker.following, {
    nullable: true,
    cascade: true,
  })
  followers: JobSeeker[];

  @OneToMany(() => Invoice, (invoice) => invoice.corporate, {
    nullable: true,
  })
  invoices: Invoice[];
  /*
  @OneToMany(() => Interview, (interview) => interview.corporate)
  interviews: Interview[];
  */
}

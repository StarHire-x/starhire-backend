import { Column, Entity, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { User } from './user.entity';
import { EventListing } from './eventListing.entity';
import { JobListing } from './jobListing.entity';
import { Chat } from './chat.entity';
import { Ticket } from './ticket.entity';
import { JobSeeker } from './jobSeeker.entity';
import { JobPreference } from './jobPreference.entity';
import { Invoice } from './invoice.entity';
import CorporatePromotionStatusEnum from '../enums/corporatePromotionStatus.enum';
import { IsEnum } from 'class-validator';
import { Review } from './review.entity';

@Entity({ name: 'corporates' })
export class Corporate extends User {
  constructor(entity: Partial<Corporate>) {
    super(entity);
    Object.assign(this, entity);
  }

  @Column()
  firstName: string;

  @Column()
  schoolName: string;

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

  @OneToMany(() => Review, (review) => review.corporate, {
    cascade: true,
    nullable: true,
  })
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
}

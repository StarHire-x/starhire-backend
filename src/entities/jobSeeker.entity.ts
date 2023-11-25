import { Column, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Entity } from 'typeorm';
import { User } from './user.entity';
import HighestEducationStatusEnum from '../enums/highestEducationStatus.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { ForumComment } from './forumComment.entity';
import { JobApplication } from './jobApplication.entity';
import { ForumPost } from './forumPost.entity';
import { Chat } from './chat.entity';
import { JobPreference } from './jobPreference.entity';
import { Ticket } from './ticket.entity';
import { JobExperience } from './jobExperience.entity';
import { JobListing } from './jobListing.entity';
import { SavedJobListing } from './savedJobListing.entity';
import VisibilityEnum from '../enums/visibility.enum';
import { Corporate } from './corporate.entity';
import { EventRegistration } from './eventRegistration.entity';
import { Review } from './review.entity';

@Entity({ name: 'jobSeekers' })
export class JobSeeker extends User {
  @Column()
  @IsOptional()
  resumePdf: string;

  // @Column()
  // fullName: string;

  // @Column()
  // dateOfBirth: Date;

  @Column()
  @IsEnum(HighestEducationStatusEnum)
  highestEducationStatus: HighestEducationStatusEnum;

  // @Column()
  // homeAddress: string;
 
  // @Column()
  // instituteName: string;

  // @Column()
  // dateOfGraduation: Date;

  @Column({
    type: 'enum',
    enum: VisibilityEnum,
    default: VisibilityEnum.PUBLIC,
  })
  @IsEnum(VisibilityEnum)
  visibility: VisibilityEnum;

  @Column()
  @IsOptional()
  profilePictureUrl: string;

  @Column()
  firstName: string;

  @Column()
  country: string;

  @Column()
  description: string;

  @Column()
  proficientLanguages: string;

  @Column()
  experience: string;

  @Column()
  certifications: string;

  @Column()
  recentRole: string;

  @Column()
  resume: string;

  @Column()
  startDate: Date;

  @Column()
  preferredRegions: string;

  @Column()
  preferredJobType: string;

  @Column()
  preferredSchedule: string;

  @Column()
  payRange: string;

  @Column()
  visaRequirements: string;

  @Column()
  ranking: string;

  @Column()
  otherInfo: string;

  @Column('varchar', { length: 4000 })
  candidateNotes: string;

  @OneToMany(() => ForumComment, (forumComment) => forumComment.jobSeeker, {
    cascade: true,
  })
  forumComments: ForumComment[];

  @OneToMany(
    () => JobApplication,
    (jobApplication) => jobApplication.jobSeeker,
    {
      cascade: true,
    },
  )
  jobApplications: JobApplication[];

  @OneToMany(
    () => EventRegistration,
    (eventRegistration) => eventRegistration.jobSeeker,
    {
      cascade: true,
    },
  )
  eventRegistrations: EventRegistration[];

  @OneToMany(() => ForumPost, (forumPost) => forumPost.jobSeeker, {
    cascade: true,
  })
  forumPosts: ForumPost[];

  @OneToMany(() => Chat, (chat) => chat.jobSeeker, {
    cascade: true,
  })
  chats: Chat[];

  @OneToOne(() => JobPreference, (preference) => preference.jobSeeker, {
    cascade: true,
    nullable: true, // one-to-one optional
  })
  jobPreference: JobPreference;

  @OneToMany(() => JobExperience, (jobExperience) => jobExperience.jobSeeker, {
    cascade: true,
  })
  jobExperiences: JobExperience[];

  @OneToMany(() => Review, (review) => review.jobSeeker, {
    cascade: true,
    nullable: true,
  })
  reviews: Review[];

  @OneToMany(() => Ticket, (ticket) => ticket.jobSeeker, {
    cascade: true,
  })
  tickets: Ticket[];

  @ManyToMany(() => JobListing, (jobListing) => jobListing.jobSeekers, {
    cascade: true,
    nullable: true, // optional
  })
  jobListings: JobListing[];

  @OneToMany(
    () => SavedJobListing,
    (savedJobListing) => savedJobListing.jobSeeker,
    {
      cascade: true,
      nullable: true,
    },
  )
  savedJobListings: SavedJobListing[];

  @ManyToMany(() => Corporate, (corporate) => corporate.followers, {
    nullable: true,
  })
  @JoinTable({ name: 'jobseeker_corporate' })
  following: Corporate[];

  constructor(entity: Partial<JobSeeker>) {
    super(entity);
    Object.assign(this, entity);
  }
}

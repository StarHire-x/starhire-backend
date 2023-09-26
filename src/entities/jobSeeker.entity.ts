import { Column, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { Entity } from 'typeorm';
import { User } from './user.entity';
import HighestEducationStatusEnum from 'src/enums/highestEducationStatus.enum';
import { IsEnum, IsOptional } from 'class-validator';
import { ForumComment } from './forumComment.entity';
import { JobApplication } from './jobApplication.entity';
import { ForumPost } from './forumPost.entity';
import { Chat } from './chat.entity';
import { JobPreference } from './jobPreference.entity';
import { Ticket } from './ticket.entity';
import { Review } from './review.entity';
import { JobExperience } from './jobExperience.entity';
import { JobListing } from './jobListing.entity';
import VisibilityEnum from 'src/enums/visibility.enum';

@Entity({ name: 'jobSeekers' })
export class JobSeeker extends User {
  @Column()
  @IsOptional()
  resumePdf: string;

  @Column()
  fullName: string;

  @Column()
  dateOfBirth: Date;

  @Column()
  @IsEnum(HighestEducationStatusEnum)
  highestEducationStatus: HighestEducationStatusEnum;

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
  homeAddress: string;

  @Column()
  instituteName: string;

  @Column()
  dateOfGraduation: Date;

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

  @OneToMany(() => Ticket, (ticket) => ticket.jobSeeker, {
    cascade: true,
  })
  tickets: Ticket[];

  @OneToMany(() => Review, (review) => review.jobSeeker, {
    cascade: true,
  })
  reviews: Review[];

  @ManyToMany(() => JobListing, (jobListing) => jobListing.jobSeekers, {
    cascade: true,
    nullable: true, // optional
  })
  jobListings: JobListing[];

  constructor(entity: Partial<JobSeeker>) {
    super(entity);
    Object.assign(this, entity);
  }
}

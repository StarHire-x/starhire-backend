import { Column, OneToMany, OneToOne } from 'typeorm';
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

@Entity({ name: 'jobSeekers' })
export class JobSeeker extends User {
  @Column()
  @IsOptional()
  resumePdf: string;

  @Column()
  fullName: string;

  @Column()
  dateOfBirth: Date;

  @IsEnum(HighestEducationStatusEnum)
  highestEducationStatus: HighestEducationStatusEnum;

  @Column()
  @IsOptional()
  profilePictureUrl: string;

  @Column()
  homeAddress: string;

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

  @OneToMany(() => Ticket, (ticket) => ticket.jobSeeker, {
    cascade: true,
  })
  tickets: Ticket[];

  @OneToMany(() => Review, (review) => review.jobSeeker, {
    cascade: true,
  })
  reviews: Review[];

  constructor(entity: Partial<JobSeeker>) {
    super(entity);
    Object.assign(this, entity);
  }
}

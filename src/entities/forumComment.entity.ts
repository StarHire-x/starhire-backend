import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ForumPost } from './forumPost.entity';
import { JobSeeker } from './jobSeeker.entity';

@Entity({ name: 'forumComments' })
export class ForumComment {
  @PrimaryGeneratedColumn()
  forumCommentId: number;

  @Column()
  createdAt: Date;

  @Column()
  forumCommentMessage: string;

  @Column()
  isAnonymous: boolean;

  @ManyToOne(() => ForumPost, (forumPost) => forumPost.forumComments, {
    nullable: false,
  })
  forumPost: ForumPost;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.forumComments, {
    nullable: false,
  })
  jobSeeker: JobSeeker;

  constructor(entity: Partial<ForumComment>) {
    Object.assign(this, entity);
  }
}

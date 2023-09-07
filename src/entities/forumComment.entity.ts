import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ForumPost } from './forumPost.entity';
import { JobSeeker } from './jobSeeker.entity';

@Entity({ name: 'forumComments' })
export class ForumComment {
  @PrimaryGeneratedColumn()
  forumCommentId: number;

  @Column({ nullable: true })
  createdAt: Date;

  @Column()
  forumCommentMessage: string;

  @Column()
  isAnonymous: boolean;

  @ManyToOne(() => ForumPost, (forumPost) => forumPost.forumComments, {})
  forumPost: ForumPost;

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.chats, {})
  jobSeeker: JobSeeker;

  constructor(entity: Partial<ForumComment>) {
    Object.assign(this, entity);
  }
}

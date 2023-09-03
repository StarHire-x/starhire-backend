import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ForumPost } from './forumPost.entity';

@Entity({ name: 'forumComments' })
export class ForumComment {
  @PrimaryGeneratedColumn()
  forumCommentId: number;

  @Column({ nullable: true })
  createdAt: Date;

  @Column()
  forumPostMessage: string;

  @Column()
  isAnonymous: boolean;

  @ManyToOne(() => ForumPost, (forumPost) => forumPost.forumComments, {
    onDelete: 'CASCADE',
  })
  forumPost: ForumPost;

  constructor(entity: Partial<ForumComment>) {
    Object.assign(this, entity);
  }
}

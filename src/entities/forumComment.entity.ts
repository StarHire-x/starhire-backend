import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}

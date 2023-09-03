import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'forumPosts' })
export class ForumPost {
  @PrimaryGeneratedColumn()
  forumPostId: number;

  @Column()
  forumPostTitle: string;

  @Column({ nullable: true })
  createdAt: Date;

  @Column()
  forumPostMessage: string;

  @Column()
  isAnonymous: boolean;
}

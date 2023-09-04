import { IsEnum } from 'class-validator';
import ForumCategoryEnum from 'src/enums/forumCategory.enum';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { ForumComment } from './forumComment.entity';
import { JobSeeker } from './jobSeeker.entity';

@Entity({ name: 'forumPosts' })
export class ForumPost {
  @PrimaryGeneratedColumn()
  forumPostId: number;

  @Column()
  forumCategory: ForumCategoryEnum;

  @Column()
  forumPostTitle: string;

  @Column({ nullable: true })
  createdAt: Date;

  @Column()
  forumPostMessage: string;

  @Column()
  isAnonymous: boolean;

  @OneToMany(() => ForumComment, (forumComment) => forumComment.forumPost, {
    cascade: true,
  })
  forumComments: ForumComment[];

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.chats, {
    onDelete: 'CASCADE',
  })
  jobSeeker: JobSeeker;

  constructor(entity: Partial<ForumPost>) {
    Object.assign(this, entity);
  }
}

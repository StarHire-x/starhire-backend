import ForumCategoryEnum from '../enums/forumCategory.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { ForumComment } from './forumComment.entity';
import { JobSeeker } from './jobSeeker.entity';
import { ForumCategory } from './forumCategory.entity';

@Entity({ name: 'forumPosts' })
export class ForumPost {
  @PrimaryGeneratedColumn()
  forumPostId: number;

  @Column()
  forumPostTitle: string;

  @Column()
  createdAt: Date;

  @Column()
  forumPostMessage: string;

  @Column()
  isAnonymous: boolean;

  @ManyToOne(() => ForumCategory, (forumCategory) => forumCategory.forumPosts, {
    nullable: false,
  })
  forumCategory: ForumCategory;

  @OneToMany(() => ForumComment, (forumComment) => forumComment.forumPost, {
    cascade: true,
    nullable: true,
  })
  forumComments: ForumComment[];

  @ManyToOne(() => JobSeeker, (jobSeeker) => jobSeeker.forumPosts, {
    nullable: false,
  })
  jobSeeker: JobSeeker;

  constructor(entity: Partial<ForumPost>) {
    Object.assign(this, entity);
  }
}

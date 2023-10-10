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
import ForumPostEnum from 'src/enums/forumPost.enum';
import { IsEnum } from 'class-validator';

@Entity({ name: 'forumPosts' })
export class ForumPost {
  @PrimaryGeneratedColumn()
  forumPostId: number;

  @Column()
  forumPostTitle: string;

  @Column()
  createdAt: Date;

  @Column('varchar', { length: 8000 })
  forumPostMessage: string;

  @Column()
  isAnonymous: boolean;

  @Column()
  @IsEnum(ForumPostEnum)
  forumPostStatus: ForumPostEnum;

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

import { IsEnum } from 'class-validator';
import ForumCategoryEnum from 'src/enums/forumCategory.enum';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ForumComment } from './forumComment.entity';

@Entity({ name: 'forumPosts' })
export class ForumPost {
  @PrimaryGeneratedColumn()
  forumPostId: number;

  @IsEnum(ForumCategoryEnum)
  forumCategoryEnum: ForumCategoryEnum;

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

  constructor(entity: Partial<ForumPost>) {
    Object.assign(this, entity);
  }
}

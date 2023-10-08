import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { ForumPost } from './forumPost.entity';

@Entity({ name: 'forumCategories' })
export class ForumCategory {
  @PrimaryGeneratedColumn()
  forumCategoryId: number;

  @Column()
  forumCategoryTitle: string;

  @Column()
  isArchived: boolean;

  @Column()
  forumGuidelines: string[];

  @OneToMany(() => ForumPost, (forumPost) => forumPost.forumCategory) // Establish one-to-many relationship
  forumPosts: ForumPost[];

  constructor(entity: Partial<ForumCategory>) {
    Object.assign(this, entity);
  }
}

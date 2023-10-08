import { Module } from '@nestjs/common';
import { ForumCategoriesController } from './forum-categories.controller';
import { ForumCategoriesService } from './forum-categories.service';
import { ForumCategory } from 'src/entities/forumCategory.entity';
import { ForumPost } from 'src/entities/forumPost.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ForumCategory, ForumPost])],
  controllers: [ForumCategoriesController],
  providers: [ForumCategoriesService],
})
export class ForumCategoriesModule {}

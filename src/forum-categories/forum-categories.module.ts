import { Module } from '@nestjs/common';
import { ForumCategoriesController } from './forum-categories.controller';
import { ForumCategoriesService } from './forum-categories.service';
import { ForumCategory } from '../entities/forumCategory.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([ForumCategory])],
  controllers: [ForumCategoriesController],
  providers: [ForumCategoriesService],
})
export class ForumCategoriesModule {}

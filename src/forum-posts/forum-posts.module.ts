import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumPostsController } from './forum-posts.controller';
import { ForumPostsService } from './forum-posts.service';
import { ForumPost } from '../entities/forumPost.entity';
import { ForumComment } from 'src/entities/forumComment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForumPost, ForumComment])],
  controllers: [ForumPostsController],
  providers: [ForumPostsService],
})
export class ForumPostsModule {}

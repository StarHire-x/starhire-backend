import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumPostsController } from './forum-posts.controller';
import { ForumPostsService } from './forum-posts.service';
import { ForumPost } from '../entities/forumPost.entity';
import { ForumComment } from 'src/entities/forumComment.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForumPost, JobSeeker])],
  controllers: [ForumPostsController],
  providers: [ForumPostsService],
})
export class ForumPostsModule {}

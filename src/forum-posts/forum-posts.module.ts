import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumPostsController } from './forum-posts.controller';
import { ForumPostsService } from './forum-posts.service';
import { ForumPost } from '../entities/forumPost.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForumPost])],
  controllers: [ForumPostsController],
  providers: [ForumPostsService],
})
export class ForumPostsModule {}

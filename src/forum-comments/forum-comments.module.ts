import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ForumCommentsController } from './forum-comments.controller';
import { ForumCommentsService } from './forum-comments.service';
import { ForumComment } from '../entities/forumComment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ForumComment])],
  controllers: [ForumCommentsController],
  providers: [ForumCommentsService],
})
export class ForumCommentsModule {}

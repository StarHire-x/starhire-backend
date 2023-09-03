import { Injectable } from '@nestjs/common';
import { CreateForumCommentDto } from './dto/create-forum-comment.dto';
import { UpdateForumCommentDto } from './dto/update-forum-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumComment } from 'src/entities/forumComment.entity';

@Injectable()
export class ForumCommentsService {
  constructor(
    @InjectRepository(ForumComment)
    private readonly userRepository: Repository<ForumComment>,
  ) {}

  create(createForumCommentDto: CreateForumCommentDto) {
    return 'This action adds a new forumComment';
  }

  findAll() {
    return `This action returns all forumComments`;
  }

  findOne(id: number) {
    return `This action returns a #${id} forumComment`;
  }

  update(id: number, updateForumCommentDto: UpdateForumCommentDto) {
    return `This action updates a #${id} forumComment`;
  }

  remove(id: number) {
    return `This action removes a #${id} forumComment`;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateForumCommentDto } from './dto/create-forum-comment.dto';
import { UpdateForumCommentDto } from './dto/update-forum-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumComment } from 'src/entities/forumComment.entity';

@Injectable()
export class ForumCommentsService {
  constructor(
    @InjectRepository(ForumComment)
    private readonly forumCommentRepository: Repository<ForumComment>,
  ) {}

  async create(createForumCommentDto: CreateForumCommentDto) {
    try {
      const forumComment = new ForumComment({
        ...createForumCommentDto,
      });

      return await this.forumCommentRepository.save(forumComment);
    } catch (err) {
      throw new HttpException(
        'Failed to create new forum comment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.forumCommentRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.forumCommentRepository.findOne({
        where: { forumCommentId: id },
        relations: {},
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find forum comment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateForumCommentDto: UpdateForumCommentDto) {
    try {
      const forumComment = await this.forumCommentRepository.findOneBy({
        forumCommentId: id,
      });

      Object.assign(forumComment, updateForumCommentDto);
      return await this.forumCommentRepository.save(forumComment);
    } catch (err) {
      throw new HttpException(
        'Failed to update forum comment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.forumCommentRepository.delete({
        forumCommentId: id,
      });
    } catch (err) {
      throw new HttpException(
        'Failed to delete forum comment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

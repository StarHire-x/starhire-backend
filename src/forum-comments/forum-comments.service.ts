import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateForumCommentDto } from './dto/create-forum-comment.dto';
import { UpdateForumCommentDto } from './dto/update-forum-comment.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumComment } from 'src/entities/forumComment.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { ForumPost } from 'src/entities/forumPost.entity';

@Injectable()
export class ForumCommentsService {
  constructor(
    @InjectRepository(ForumComment)
    private readonly forumCommentRepository: Repository<ForumComment>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(ForumPost)
    private readonly forumPostRepository: Repository<ForumPost>,
  ) {}

  async create(
    jobSeekerId: number,
    forumPostId: number,
    createForumCommentDto: CreateForumCommentDto,
  ) {
    try {
      const findJobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: jobSeekerId,
      });
      if (!findJobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      const findForumPost = await this.forumPostRepository.findOneBy({
        forumPostId: forumPostId,
      });
      if (!findForumPost) {
        throw new NotFoundException('Forum Post Id provided is not valid');
      }

      const { jobSeeker, forumPost, ...dtoExcludeRelationship } =
        createForumCommentDto;

      const forumComment = new ForumComment({
        ...dtoExcludeRelationship,
        jobSeeker: findJobSeeker,
        forumPost: findForumPost,
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

      if (!forumComment) {
        throw new NotFoundException('Forum comment Id provided is not valid');
      }
       const { jobSeeker, forumPost, ...dtoExcludeRelationship } =
         updateForumCommentDto;
      Object.assign(forumComment, dtoExcludeRelationship);
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

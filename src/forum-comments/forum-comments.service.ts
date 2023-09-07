import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

  async create(createForumCommentDto: CreateForumCommentDto) {
    try {
      // Ensure valid job seeker id and valid forum post id are provided
      const { jobSeekerId, forumPostId, ...dtoExcludingParentId } =
        createForumCommentDto;

      const jobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: jobSeekerId,
      });
      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      const forumPost = await this.forumPostRepository.findOneBy({
        forumPostId: forumPostId,
      });
      if (!forumPost) {
        throw new NotFoundException('Forum Post Id provided is not valid');
      }

      // Create the forum comment, establishing relationships to parents
      const forumComment = new ForumComment({
        ...dtoExcludingParentId,
        jobSeeker,
        forumPost,
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
      // I want to know which job seeker posted the comment and which forum post the comment belongs to
      return await this.forumCommentRepository.findOne({
        where: { forumCommentId: id },
        relations: { jobSeeker: true, forumPost: true },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find forum comment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Note: Since forumCommentId is provided as a req param, there is no need to include it in the req body (dto object)
  async update(id: number, updateForumCommentDto: UpdateForumCommentDto) {
    try {
      // Ensure valid Forum Comment Id is provided
      const forumComment = await this.forumCommentRepository.findOneBy({
        forumCommentId: id,
      });

      if (!forumComment) {
        throw new NotFoundException('Forum comment Id provided is invalid');
      }

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

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ForumPost } from 'src/entities/forumPost.entity';
import { ForumComment } from 'src/entities/forumComment.entity';
import ForumCategoryEnum from 'src/enums/forumCategory.enum';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

@Injectable()
export class ForumPostsService {
  constructor(
    @InjectRepository(ForumPost)
    private readonly forumPostRepository: Repository<ForumPost>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
  ) {}

  async create(createForumPostDto: CreateForumPostDto) {
    try {
      const { jobSeekerId, ...dtoExcludeRelationship } = createForumPostDto;
      const jobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: jobSeekerId,
      });
      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      const forumPost = new ForumPost({
        ...dtoExcludeRelationship,
        jobSeeker: jobSeeker,
      });

      forumPost.forumCategory = this.mapJsonToEnum(
        createForumPostDto.forumCategory,
      );

      return await this.forumPostRepository.save(forumPost);
    } catch (err) {
      throw new HttpException(
        'Failed to create new forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return this.forumPostRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.forumPostRepository.findOne({
        where: { forumPostId: id },
        relations: { forumComments: true },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateForumPostDto: UpdateForumPostDto) {
    try {
      const forumPost = await this.forumPostRepository.findOneBy({
        forumPostId: id,
      });

      if (!forumPost) {
        throw new NotFoundException('Forum Post Id provided is not valid');
      }

      const { jobSeekerId, ...dtoExcludeRelationship } = updateForumPostDto;

      Object.assign(forumPost, dtoExcludeRelationship);

      forumPost.forumCategory = this.mapJsonToEnum(
        updateForumPostDto.forumCategory,
      );

      return await this.forumPostRepository.save(forumPost);
    } catch (err) {
      throw new HttpException(
        'Failed to update forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.forumPostRepository.delete({ forumPostId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  mapJsonToEnum(status: string): ForumCategoryEnum {
    switch (status) {
      case 'Job':
        return ForumCategoryEnum.JOB;
      case 'Event':
        return ForumCategoryEnum.EVENT;
      case 'Career':
        return ForumCategoryEnum.CAREER;
      case 'Confession':
        return ForumCategoryEnum.CONFESSION;
      case 'Misc':
        return ForumCategoryEnum.MISC;
    }
  }
}

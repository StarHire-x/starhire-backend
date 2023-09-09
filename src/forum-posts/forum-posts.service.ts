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
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { mapForumCategoryToEnum } from 'src/common/mapStringToEnum';

@Injectable()
export class ForumPostsService {
  constructor(
    @InjectRepository(ForumPost)
    private readonly forumPostRepository: Repository<ForumPost>,
    // Parent Entity
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
  ) {}

  async create(createForumPostDto: CreateForumPostDto) {
    try {
      // Ensure valid job seeker id is provided
      const { jobSeekerId, ...dtoExcludingParentId } = createForumPostDto;

      const jobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: jobSeekerId,
      });
      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      // Ensure forumCategory field is a valid enum
      const mappedStatus = mapForumCategoryToEnum(
        createForumPostDto.forumCategory,
      );
      createForumPostDto.forumCategory = mappedStatus;

      // Create the forum post, establishing relationship to parent (job seeker entity)
      const forumPost = new ForumPost({
        ...dtoExcludingParentId,
        jobSeeker,
      });
      return await this.forumPostRepository.save(forumPost);
    } catch (err) {
      throw new HttpException(
        'Failed to create new forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Note: No child entities are returned, since it is not specified in the relations field
  async findAll() {
    return this.forumPostRepository.find();
  }

  // Note: Associated parent and child entities will be returned as well, since they are specified in the relations field
  async findOne(id: number) {
    try {
      return await this.forumPostRepository.findOne({
        where: { forumPostId: id },
        relations: { jobSeeker: true, forumComments: true },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Note: Since forumPostId is provided as a req param, there is no need to include it in the req body (dto object)
  async update(id: number, updateForumPostDto: UpdateForumPostDto) {
    try {
      // Ensure valid forum post Id is provided
      const forumPost = await this.forumPostRepository.findOneBy({
        forumPostId: id,
      });
      if (!forumPost) {
        throw new NotFoundException('Forum Post Id provided is not valid');
      }

      // If forumCategory is to be updated, ensure it is a valid enum
      if (updateForumPostDto.forumCategory) {
        const mappedStatus = mapForumCategoryToEnum(
          updateForumPostDto.forumCategory,
        );
        updateForumPostDto.forumCategory = mappedStatus;
      }
      Object.assign(forumPost, updateForumPostDto);
      return await this.forumPostRepository.save(forumPost);
    } catch (err) {
      throw new HttpException(
        'Failed to update forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Note: Associated child entities(forum comments) will be removed as well, since cascade is set to true in the entity class
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
}

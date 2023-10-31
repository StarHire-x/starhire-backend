import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateForumPostDto } from './dto/create-forum-post.dto';
import { UpdateForumPostDto } from './dto/update-forum-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { MoreThanOrEqual, Repository } from 'typeorm';
import { ForumPost } from '../entities/forumPost.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { mapForumCategoryToEnum } from '../common/mapStringToEnum';
import { ForumCategory } from '../entities/forumCategory.entity';
import ForumPostEnum from '../enums/forumPost.enum';

@Injectable()
export class ForumPostsService {
  constructor(
    @InjectRepository(ForumPost)
    private readonly forumPostRepository: Repository<ForumPost>,
    // Parent Entity
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(ForumCategory)
    private readonly forumCategoryRepository: Repository<ForumCategory>,
  ) {}

  async create(createForumPostDto: CreateForumPostDto) {
    try {
      // Ensure valid job seeker id is provided
      const { jobSeekerId, forumCategoryId, ...dtoExcludingParentId } =
        createForumPostDto;

      const jobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: jobSeekerId,
      });
      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      // Ensure forumCategory exists
      const forumCategory = await this.forumCategoryRepository.findOneBy({
        forumCategoryId: forumCategoryId,
      });
      if (!forumCategory) {
        throw new NotFoundException('Forum Category provided is not valid');
      }

      // Create the forum post, establishing relationship to parent (job seeker entity)
      const forumPost = new ForumPost({
        ...dtoExcludingParentId,
        jobSeeker,
        forumCategory,
      });
      await this.forumPostRepository.save(forumPost);
      return {
        statusCode: HttpStatus.CREATED,
        message: 'Forum post has been created',
      };
    } catch (err) {
      throw new HttpException(
        'Failed to create new forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Note: No child entities are returned, since it is not specified in the relations field
  async findAll() {
    return this.forumPostRepository.find({
      order: {
        createdAt: 'DESC',
      },
      relations: { jobSeeker: true, forumCategory: true },
      loadRelationIds: { relations: ['forumComments'] }, // to retrieve number of comments only, no need fetch the entire comment object
      where: [
        // {
        //   forumPostStatus: ForumPostEnum.Pending,
        //   forumCategory: { isArchived: false },
        // },
        {
          forumPostStatus: ForumPostEnum.Reported,
          forumCategory: { isArchived: false },
        },
        {
          forumPostStatus: ForumPostEnum.Active,
          forumCategory: { isArchived: false },
        },
      ],
    });
  }

  // Note: Associated parent and child entities will be returned as well, since they are specified in the relations field
  async findOne(id: number) {
    try {
      return await this.forumPostRepository.findOne({
        where: { forumPostId: id },
        relations: { jobSeeker: true },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findForumPostsByJobSeekerId(jobSeekerId: string) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: jobSeekerId },
      });
      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      const response = await this.forumPostRepository.find({
        order: {
          createdAt: 'DESC',
        },
        where: [
          {
            jobSeeker: { userId: jobSeeker.userId },
            forumPostStatus: ForumPostEnum.Pending,
          },
          {
            jobSeeker: { userId: jobSeeker.userId },
            forumPostStatus: ForumPostEnum.Active,
          },
          {
            jobSeeker: { userId: jobSeeker.userId },
            forumPostStatus: ForumPostEnum.Reported,
          },
        ],
        relations: {
          jobSeeker: true,
          forumCategory: true,
        },
        loadRelationIds: { relations: ['forumComments'] }, // to retrieve number of comments only, no need fetch the entire comment object
      });
      return response;
    } catch (err) {
      throw new HttpException(
        'Failed to find forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findForumPostByForumCategoryId(forumCategoryId: number) {
    try {
      const forumCategory = await this.forumCategoryRepository.findOne({
        where: { forumCategoryId: forumCategoryId },
      });
      if (!forumCategory) {
        throw new NotFoundException('Forum category Id provided is not valid');
      }

      const response = await this.forumPostRepository.find({
        order: {
          createdAt: 'DESC',
        },
        where: [
          // {
          //   forumCategory: {
          //     forumCategoryId: forumCategoryId,
          //     isArchived: false,
          //   },
          //   forumPostStatus: ForumPostEnum.Pending,
          // },
          {
            forumCategory: {
              forumCategoryId: forumCategoryId,
              isArchived: false,
            },
            forumPostStatus: ForumPostEnum.Active,
          },
          {
            forumCategory: {
              forumCategoryId: forumCategoryId,
              isArchived: false,
            },
            forumPostStatus: ForumPostEnum.Reported,
          },
        ],
        relations: { jobSeeker: true, forumCategory: true },
        loadRelationIds: { relations: ['forumComments'] }, // to retrieve number of comments only, no need fetch the entire comment object
      });
      return response;
    } catch (err) {
      throw new HttpException(
        'Failed to retrieve forum posts',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // change forum post status to "inactive"
  async deleteOwnForumPostByPostIdAndUserId(
    forumPostId: number,
    userId: string,
  ) {
    try {
      // Ensure valid forum post Id is provided
      const forumPost = await this.forumPostRepository.findOneBy({
        forumPostId: forumPostId,
        jobSeeker: { userId: userId },
      });
      if (!forumPost) {
        throw new NotFoundException('Forum Post Id provided is not valid');
      }

      forumPost.forumPostStatus = ForumPostEnum.Deleted;
      return await this.forumPostRepository.save(forumPost);
    } catch (err) {
      throw new HttpException(
        'Failed to delete a forum post',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // change forum post status to "Reported"
  async updateForumPostToReported(forumPostId: number) {
    try {
      // Ensure valid forum post Id is provided
      const forumPost = await this.forumPostRepository.findOneBy({
        forumPostId: forumPostId,
      });
      if (!forumPost) {
        throw new NotFoundException('Forum Post Id provided is not valid');
      }

      forumPost.forumPostStatus = ForumPostEnum.Reported;
      return await this.forumPostRepository.save(forumPost);
    } catch (err) {
      throw new HttpException(
        'Failed to update this forum post to Reported',
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

      //forumCategory cannot be updated

      Object.assign(forumPost, { ...updateForumPostDto });
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

import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import HighestEducationStatusEnum from 'src/enums/highestEducationStatus.enum';
import { ForumComment } from 'src/entities/forumComment.entity';
import { JobPreference } from 'src/entities/jobPreference.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { ForumPost } from 'src/entities/forumPost.entity';
import { Chat } from 'src/entities/chat.entity';

@Injectable()
export class JobSeekerService {
  constructor(
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
  ) {}

  async create(createJobSeekerDto: CreateJobSeekerDto) {
    try {
      const jobSeeker = new JobSeeker({ ...createJobSeekerDto });
      return await this.jobSeekerRepository.save(jobSeeker);
    } catch (err) {
      throw new HttpException(
        'Failed to create new job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.jobSeekerRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.jobSeekerRepository.findOne({
        where: { userId: id },
        relations: {
          forumComments: true,
          jobPreference: true,
          jobApplications: true,
          forumPosts: true,
          chats: true,
        },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateJobSeeker: UpdateJobSeekerDto) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: id,
      });

      const { confirmPassword, ...updateJobSeekerDto } = updateJobSeeker;
      const {
        forumComments,
        jobPreference,
        jobApplications,
        forumPosts,
        chats,
        ...dtoExcludeRelationship
      } = updateJobSeekerDto;
      Object.assign(jobSeeker, dtoExcludeRelationship);

      jobSeeker.highestEducationStatus = this.mapJsonToEnum(updateJobSeekerDto.highestEducationStatus);

      if (forumComments && forumComments.length > 0) {
        const updatedForumComments = forumComments.map(
          (createForumCommentsDto) => {
            const { ...dtoExcludeRelationship } =
              createForumCommentsDto;
            return new ForumComment(dtoExcludeRelationship);
          },
        );
        jobSeeker.forumComments = updatedForumComments;
      }

      if (jobPreference) {
        const { ...dtoExcludeRelationship } = jobPreference;
        const updatedJobPrederence = new JobPreference(dtoExcludeRelationship);
        jobSeeker.jobPreference = updatedJobPrederence;
      }

      if (jobApplications && jobApplications.length > 0) {
        const updatedJobApplication = jobApplications.map(
          (createJobApplicationDto) => {
            const { documents, ...dtoExcludeRelationship } = createJobApplicationDto;
            return new JobApplication(dtoExcludeRelationship);
          },
        );
        jobSeeker.jobApplications = updatedJobApplication;
      }

      if (forumPosts && forumPosts.length > 0) {
        const updatedForumPosts = forumPosts.map(
          (createForumPostsDto) => {
            const { forumComments, ...dtoExcludeRelationship } = createForumPostsDto;
            return new ForumPost(dtoExcludeRelationship);
          },
        );
        jobSeeker.forumPosts = updatedForumPosts;
      }

      if (chats && chats.length > 0) {
        const updatedChats = chats.map((createChatsDto) => {
          const { chatMessages, ...dtoExcludeRelationship } = createChatsDto;
          return new Chat(dtoExcludeRelationship);
        });
        jobSeeker.chats = updatedChats;
      }

      return await this.jobSeekerRepository.save(jobSeeker);
    } catch (err) {
      throw new HttpException(
        'Failed to update job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.jobSeekerRepository.delete({
        userId: id,
      });
    } catch (err) {
      throw new HttpException(
        'Failed to delete job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  mapJsonToEnum(status: string): HighestEducationStatusEnum {
    switch (status) {
      case 'No School':
        return HighestEducationStatusEnum.NO_SCHOOL;
      case 'High School':
        return HighestEducationStatusEnum.HIGH_SCHOOL;
      case 'Bachelor':
        return HighestEducationStatusEnum.BACHELOR;
      case 'Master':
        return HighestEducationStatusEnum.MASTER;
      case 'Doctorate':
        return HighestEducationStatusEnum.DOCTORATE;
    }
  }
}

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
import {
  mapEducationStatusToEnum,
  mapNotificationModeToEnum,
  mapUserRoleToEnum,
  mapUserStatusToEnum,
} from 'src/common/mapStringToEnum';

@Injectable()
export class JobSeekerService {
  constructor(
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
  ) {}

  async create(createJobSeekerDto: CreateJobSeekerDto) {
    try {
      const jobSeeker = new JobSeeker({ ...createJobSeekerDto });

      // Convert all ENUM values
      if (jobSeeker.status) {
        jobSeeker.status = mapUserStatusToEnum(jobSeeker.status);
      }
      if (jobSeeker.notificationMode) {
        jobSeeker.notificationMode = mapNotificationModeToEnum(
          jobSeeker.notificationMode,
        );
      }
      if (jobSeeker.role) {
        jobSeeker.role = mapUserRoleToEnum(jobSeeker.role);
      }
      if (jobSeeker.highestEducationStatus) {
        jobSeeker.highestEducationStatus = mapEducationStatusToEnum(
          jobSeeker.highestEducationStatus,
        );
      }
      await this.jobSeekerRepository.save(jobSeeker);
      if (jobSeeker) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker created',
          data: jobSeeker,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job seeker failed to be created',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to create job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Added code to handle different request
  async findByEmail(email: string) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { email },
      });

      if (jobSeeker) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker found',
          data: jobSeeker,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job seeker not found',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to find job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Added code to handle different request
  async findByUserId(userId: string) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId },
      });

      if (jobSeeker) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker found',
          data: jobSeeker,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job seeker not found',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to find job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: id },
        relations: {
          forumComments: true,
          jobPreference: true,
          jobApplications: true,
          forumPosts: true,
          chats: true,
          tickets: true,
          jobListings: true,
          // reviews: true,
        },
      });
      return jobSeeker;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updatedJobSeeker: UpdateJobSeekerDto) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: id,
      });

      if (!jobSeeker) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job seeker id not found',
          data: [],
        };
      }

      Object.assign(jobSeeker, updatedJobSeeker);

      jobSeeker.highestEducationStatus = mapEducationStatusToEnum(
        updatedJobSeeker.highestEducationStatus,
      );

      await this.jobSeekerRepository.save(jobSeeker);

      if (jobSeeker) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker updated',
          data: jobSeeker,
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to update job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const jobSeekers = await this.jobSeekerRepository.find({
        relations: { chats: true },
      });
      if (jobSeekers.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker found',
          data: jobSeekers,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job seeker not found',
          data: [],
        };
      }
    } catch {
      throw new HttpException(
        'Failed to find job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
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
}

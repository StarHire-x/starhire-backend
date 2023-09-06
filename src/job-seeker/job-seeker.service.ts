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
import UserStatusEnum from 'src/enums/userStatus.enum';
import NotificationModeEnum from 'src/enums/notificationMode.enum';
import UserRoleEnum from 'src/enums/userRole.enum';

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
        jobSeeker.status = this.mapStatusToEnum(jobSeeker.status);
      }
      if (jobSeeker.notificationMode) {
        jobSeeker.notificationMode = this.mapNotificationToEnum(
          jobSeeker.notificationMode,
        );
      }
      if (jobSeeker.role) {
        jobSeeker.role = this.mapRoleToEnum(jobSeeker.role);
      }
      if (jobSeeker.highestEducationStatus) {
        jobSeeker.highestEducationStatus = this.mapEducationToEnum(
          jobSeeker.highestEducationStatus,
        );
      }
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
          // jobPreference: true,
          jobApplications: true,
          forumPosts: true,
          chats: true,
          // reviews: true,
        },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updatedJobSeeker: UpdateJobSeekerDto) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: id,
      });

      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      Object.assign(jobSeeker, updatedJobSeeker);

      jobSeeker.highestEducationStatus = this.mapEducationToEnum(
        updatedJobSeeker.highestEducationStatus,
      );

      return await this.jobSeekerRepository.save(jobSeeker);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
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

  mapEducationToEnum(status: string): HighestEducationStatusEnum {
    switch (status) {
      case 'No_School':
        return HighestEducationStatusEnum.NO_SCHOOL;
      case 'High_School':
        return HighestEducationStatusEnum.HIGH_SCHOOL;
      case 'Bachelor':
        return HighestEducationStatusEnum.BACHELOR;
      case 'Master':
        return HighestEducationStatusEnum.MASTER;
      case 'Doctorate':
        return HighestEducationStatusEnum.DOCTORATE;
    }
  }
  mapNotificationToEnum(status: string): NotificationModeEnum {
    switch (status) {
      case 'Sms':
        return NotificationModeEnum.SMS;
      default:
        return NotificationModeEnum.EMAIL;
    }
  }
  mapStatusToEnum(status: string): UserStatusEnum {
    switch (status) {
      case 'Inactive':
        return UserStatusEnum.INACTIVE;
      default:
        return UserStatusEnum.ACTIVE;
    }
  }
  mapRoleToEnum(status: string): UserRoleEnum {
    switch (status) {
      case 'Recruiter':
        return UserRoleEnum.RECRUITER;
      case 'Corporate':
        return UserRoleEnum.CORPORATE;
      case 'Administrator':
        return UserRoleEnum.ADMINISTRATOR;
      default:
        return UserRoleEnum.JOBSEEKER;
    }
  }
}

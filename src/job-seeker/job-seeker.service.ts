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
          // reviews: true,
        },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find job application',
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

      jobSeeker.highestEducationStatus = this.mapJsonToEnum(
        updatedJobSeeker.highestEducationStatus,
      );

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
}

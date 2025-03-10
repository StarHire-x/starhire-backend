import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobExperienceDto } from './dto/create-job-experience.dto';
import { UpdateJobExperienceDto } from './dto/update-job-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobExperience } from '../entities/jobExperience.entity';
import { Repository } from 'typeorm';
import { JobSeeker } from '../entities/jobSeeker.entity';

@Injectable()
export class JobExperienceService {
  constructor(
    @InjectRepository(JobExperience)
    private readonly jobExperienceRepository: Repository<JobExperience>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
  ) {}

  async create(createJobExperienceDto: CreateJobExperienceDto) {
    try {
      console.log('Hello');
      const { jobSeekerId, ...dtoExcludeRelationship } = createJobExperienceDto;
      const jobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: jobSeekerId,
      });

      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      const jobExperience = new JobExperience({
        ...dtoExcludeRelationship,
        jobSeeker,
      });
      await this.jobExperienceRepository.save(jobExperience);
      return {
        statusCode: HttpStatus.OK,
        message: 'Job experience is created',
        data: jobExperience,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const jobExperiences = await this.jobExperienceRepository.find();
      return jobExperiences;
    } catch (error) {
      throw new HttpException(
        'Failed to fetch job experiences',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const jobExperience = await this.jobExperienceRepository.findOne({
        where: { jobExperienceId: id },
        relations: { jobSeeker: true },
      });

      if (!jobExperience) {
        throw new NotFoundException('Job experience not found');
      }

      return jobExperience;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByJobSeekerId(jobSeekerId: string) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: jobSeekerId },
        relations: { jobExperiences: true },
      });

      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Job experience is found',
        data: jobSeeker.jobExperiences,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateJobExperienceDto: UpdateJobExperienceDto) {
    const jobExperience = await this.findOne(id);

    if (!jobExperience) {
      throw new NotFoundException('Job Experience Id provided is not valid');
    }

    const { jobSeekerId, ...dtoExcludeRelationship } = updateJobExperienceDto;

    Object.assign(jobExperience, dtoExcludeRelationship);

    await this.jobExperienceRepository.save(jobExperience);

    return {
      statusCode: 200,
      message: 'Job preference updated',
      data: jobExperience,
    };
  }

  async remove(id: number) {
    try {
      const result = await this.jobExperienceRepository.delete({ jobExperienceId: id });
      if (result.affected === 0) {
        throw new HttpException('Job experience id not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}

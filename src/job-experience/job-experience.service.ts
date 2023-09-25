import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobExperienceDto } from './dto/create-job-experience.dto';
import { UpdateJobExperienceDto } from './dto/update-job-experience.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobExperience } from 'src/entities/jobExperience';
import { Repository } from 'typeorm';
import { JobSeeker } from 'src/entities/jobSeeker.entity';

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
    return await this.jobExperienceRepository.find();
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
      const jobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: jobSeekerId,
      });

      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Job experience is found',
        data: jobSeeker.jobExperience,
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
      return await this.jobExperienceRepository.delete({ jobExperienceId: id });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}

import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobPreferenceDto } from './dto/create-job-preference.dto';
import { UpdateJobPreferenceDto } from './dto/update-job-preference.dto';
import { JobPreference } from 'src/entities/jobPreference.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobSeekerService } from 'src/job-seeker/job-seeker.service';

@Injectable()
export class JobPreferenceService {
  constructor(
    @InjectRepository(JobPreference)
    private readonly jobPreferenceRepository: Repository<JobPreference>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    private jobSeekerService: JobSeekerService,
  ) {}

  async create(createJobPreference: CreateJobPreferenceDto) {
    try {
      const { jobSeekerId, ...dtoExcludeRelationship } = createJobPreference;
      const findJobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: jobSeekerId,
      });

      if (!findJobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }
      if (findJobSeeker.jobPreference != null) {
        throw new ConflictException('Job Seeker already has a Job Preference!');
      }

      // Create a new JobPreference entity
      const jobPreference = new JobPreference({
        ...dtoExcludeRelationship,
        jobSeeker: findJobSeeker,
      });
      await this.jobPreferenceRepository.save(jobPreference);
      return jobPreference;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.jobPreferenceRepository.find();
  }

  async findOne(id: number) {
    try {
      const jobPreference = await this.jobPreferenceRepository.findOne({
        where: { jobPreferenceId: id },
        relations: { jobSeeker: true },
      });

      return jobPreference;
    } catch (err) {
      throw new HttpException(
        'Failed to find job preference',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByJobSeekerId(jobSeekerId: number) {
    try {
      const findJobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: jobSeekerId },
        relations: { jobPreference: true },
      });
      if (!findJobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      } else if (findJobSeeker.jobPreference == null) {
        throw new NotFoundException('Job Seeker has no Job Preference!');
      }

      return findJobSeeker.jobPreference;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: number, updateJobPreference: UpdateJobPreferenceDto) {
    // Ensure valid job listing Id is provided
    const jobPreference = await this.findOne(id);
    if (!jobPreference) {
      throw new NotFoundException('Job Preference Id provided is not valid');
    }
    const { jobSeekerId, ...dtoExcludeRelationship } = updateJobPreference;
    Object.assign(jobPreference, dtoExcludeRelationship);
    return await this.jobPreferenceRepository.save(jobPreference);
  }
  catch(err) {
    throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
  }

  async remove(id: number) {
    try {
      return await this.jobPreferenceRepository.delete({ jobPreferenceId: id });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}

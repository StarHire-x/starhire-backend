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
  ) {}

  async create(
    jobSeekerId: number,
    createJobPreference: CreateJobPreferenceDto,
  ) {
    try {
      const { jobSeeker, ...dtoExcludeRelationship } = createJobPreference;
      const findJobSeeker = await this.jobSeekerRepository.findOneBy({ userId: jobSeekerId });
      if (!findJobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }
      const jobPreference = new JobPreference({
        ...dtoExcludeRelationship,
        jobSeeker: findJobSeeker,
      });
      return await this.jobPreferenceRepository.save(jobPreference);
    } catch (err) {
      throw new HttpException(
        'Failed to create new job preference',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.jobPreferenceRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.jobPreferenceRepository.findOne({
        where: { jobPreferenceId: id },
        relations: { jobSeeker: true },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find job preference',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateJobPreference: UpdateJobPreferenceDto) {
    // Ensure valid job listing Id is provided
    const jobListing = await this.findOne(id);
    if (!jobListing) {
      throw new NotFoundException('Job Listing Id provided is not valid');
    }
    const { jobSeeker, ...dtoExcludeRelationship } = updateJobPreference;
    Object.assign(jobListing, dtoExcludeRelationship);
    return await this.jobPreferenceRepository.save(jobListing);
  }
  catch(err) {
    throw new HttpException(
      'Failed to update job preference',
      HttpStatus.BAD_REQUEST,
    );
  }

  async remove(id: number) {
    try {
      return await this.jobPreferenceRepository.delete({ jobPreferenceId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete job preference',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

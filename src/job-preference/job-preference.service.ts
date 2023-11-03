import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobPreferenceDto } from './dto/create-job-preference.dto';
import { UpdateJobPreferenceDto } from './dto/update-job-preference.dto';
import { JobPreference } from '../entities/jobPreference.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Corporate } from '../entities/corporate.entity';
import UserRoleEnum from '../enums/userRole.enum';

@Injectable()
export class JobPreferenceService {
  constructor(
    @InjectRepository(JobPreference)
    private readonly jobPreferenceRepository: Repository<JobPreference>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
  ) {}

  async create(createJobPreference: CreateJobPreferenceDto) {
    try {
      const { jobSeekerId, corporateId, ...dtoExcludeRelationship } =
        createJobPreference;

      if (jobSeekerId) {
        const jobSeeker = await this.jobSeekerRepository.findOne({
          where: { userId: jobSeekerId },
          relations: {
            jobPreference: true,
          },
        });

        if (!jobSeeker) {
          throw new NotFoundException('Job Seeker Id provided is not valid');
        }
        if (jobSeeker.jobPreference) {
          throw new ConflictException(
            'Job Seeker already has a Job Preference!',
          );
        }

        // Create a new JobPreference entity
        const jobPreference = new JobPreference({
          ...dtoExcludeRelationship,
          jobSeeker: jobSeeker,
        });
        await this.jobPreferenceRepository.save(jobPreference);
        return {
          statusCode: HttpStatus.OK,
          message: 'Job preference is created for job seeker',
          data: jobPreference,
        };
      }

      if (corporateId) {
        const corporate = await this.corporateRepository.findOne({
          where: { userId: corporateId },
          relations: {
            jobPreference: true,
          },
        });

        if (!corporate) {
          throw new NotFoundException('Corporate Id provided is not valid');
        }
        if (corporate.jobPreference) {
          throw new ConflictException(
            'Corporate already has a Job Preference!',
          );
        }

        // Create a new JobPreference entity
        const jobPreference = new JobPreference({
          ...dtoExcludeRelationship,
          corporate: corporate,
        });
        await this.jobPreferenceRepository.save(jobPreference);
        return {
          statusCode: HttpStatus.OK,
          message: 'Job preference is created for corporate',
          data: jobPreference,
        };
      }
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    try {
      const jobPreference = await this.jobPreferenceRepository.find();
      if (jobPreference.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job Preference found',
          data: jobPreference,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job Preference not found',
          data: [],
        };
      }
    } catch {
      throw new HttpException(
        'Failed to find Job Preference',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
    try {
      const jobPreference = await this.jobPreferenceRepository.findOne({
        where: { jobPreferenceId: id },
        relations: { jobSeeker: true },
      });

      if (!jobPreference) {
        throw new NotFoundException('Job preference not found');
      }

      return jobPreference;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findByJobSeekerId(jobSeekerId: string) {
    const jobSeeker = await this.jobSeekerRepository.findOne({
      where: { userId: jobSeekerId },
      relations: { jobPreference: true },
    });

    if (!jobSeeker) {
      throw new NotFoundException('Job Seeker Id provided is not valid');
    }
    if (!jobSeeker.jobPreference) {
      throw new NotFoundException('Job Seeker has no existing job preference');
    }
    return {
      statusCode: HttpStatus.OK,
      message: 'Job preference is found',
      data: jobSeeker.jobPreference,
    };
  }

  async findPreferenceByUserId(userId: string, role: string) {
    if (role === UserRoleEnum.JOBSEEKER) {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: userId },
        relations: { jobPreference: true },
      });

      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }
      if (!jobSeeker.jobPreference) {
        throw new NotFoundException(
          'Job Seeker has no existing job preference',
        );
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Job preference is found',
        data: jobSeeker.jobPreference,
      };
    } else if (role === UserRoleEnum.CORPORATE) {
      const corporate = await this.corporateRepository.findOne({
        where: { userId: userId },
        relations: { jobPreference: true },
      });

      if (!corporate) {
        throw new NotFoundException('Corporate Id provided is not valid');
      }
      if (!corporate.jobPreference) {
        throw new NotFoundException('Corporate has no existing job preference');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Job preference is found',
        data: corporate.jobPreference,
      };
    }
  }

  async update(id: number, updateJobPreference: UpdateJobPreferenceDto) {
    try {
      const jobPreference = await this.findOne(id);

      if (!jobPreference) {
        throw new NotFoundException('Job Preference Id provided is not valid');
      }

      const { jobSeekerId, corporateId, ...dtoExcludeRelationship } =
        updateJobPreference;

      Object.assign(jobPreference, dtoExcludeRelationship);

      await this.jobPreferenceRepository.save(jobPreference);

      return {
        statusCode: 200,
        message: 'Job preference updated',
        data: jobPreference,
      };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      const result = await this.jobPreferenceRepository.delete({
        jobPreferenceId: id,
      });
      if (result.affected === 0) {
        throw new HttpException('Job Preference id not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}

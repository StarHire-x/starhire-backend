import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import { JobSeekerRepo } from './job-seeker.repo';

@Injectable()
export class JobSeekerService {
  constructor(private readonly jobSeekerRepo: JobSeekerRepo) {}

  async create(createJobSeeker: CreateJobSeekerDto) {
    try {
      const { ...jobSeekerDetail } = createJobSeeker;
      return await this.jobSeekerRepo.createJobSeeker(jobSeekerDetail);
    } catch (err) {
      throw new ConflictException(
        'Inserting a duplicate entry into the database. Please check your data.',
      );
    }
  }

  async findAll() {
    return await this.jobSeekerRepo.findAllJobSeekers();
  }

  async findOne(id: number) {
    const jobSeeker = await this.jobSeekerRepo.findOneJobSeeker(id);
    if (jobSeeker === null) {
      throw new NotFoundException(`Job Seeker with ID ${id} not found`);
    } else {
      return jobSeeker;
    }
  }

  async update(id: number, updateJobSeeker: UpdateJobSeekerDto) {
    const jobSeeker = await this.jobSeekerRepo.findOneJobSeeker(id);
    if (jobSeeker === null) {
      throw new NotFoundException(
        `Job Seeker with ID ${id} not found, Update Unsuccessful`,
      );
    } else {
      return await this.jobSeekerRepo.updateJobSeeker(id, updateJobSeeker);
    }
  }

  async remove(id: number) {
    const jobSeeker = await this.jobSeekerRepo.findOneJobSeeker(id);
    if (jobSeeker === null) {
      throw new NotFoundException(
        `Job Seeker with ID ${id} not found, Delete Unsuccessful`,
      );
    } else {
      return await this.jobSeekerRepo.deleteJobSeeker(id);
    }
  }
}

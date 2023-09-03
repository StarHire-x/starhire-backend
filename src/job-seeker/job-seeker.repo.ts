import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobSeekerDetailDto } from './dto/job-seeker-detail.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';

@Injectable()
export class JobSeekerRepo {
  constructor(
    @InjectRepository(JobSeeker)
    private jobSeekerRepository: Repository<JobSeeker>,
  ) {}

  async findAllJobSeekers(): Promise<JobSeeker[]> {
    return this.jobSeekerRepository.find();
  }

  async findOneJobSeeker(jobSeekerId: number): Promise<JobSeeker> {
    return await this.jobSeekerRepository.findOneBy({
      userId: jobSeekerId,
    });
  }

  async createJobSeeker(
    jobSeekerDetails: JobSeekerDetailDto,
  ): Promise<JobSeeker> {
    const newJobSeeker = this.jobSeekerRepository.create({
      ...jobSeekerDetails,
    });
    return this.jobSeekerRepository.save(newJobSeeker);
  }

  async deleteJobSeeker(jobSeekerId: number): Promise<void> {
    const jobSeeker = await this.jobSeekerRepository.findOneBy({
      userId: jobSeekerId,
    });
    await this.jobSeekerRepository.remove(jobSeeker);
  }

  async updateJobSeeker(
    jobSeekerId: number,
    userDetails: UpdateJobSeekerDto,
  ): Promise<JobSeeker> {
    const updateResult = await this.jobSeekerRepository.update(
      { userId: jobSeekerId },
      { ...userDetails },
    );
    const updatedJobSeeker: JobSeeker =
      await this.jobSeekerRepository.findOneBy({
        userId: jobSeekerId,
      });
    return updatedJobSeeker;
  }
}

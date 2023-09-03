import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobSeekerDetailDto } from './dto/job-seeker-detail.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';

@Injectable()
export class JobPreferenceRepo {
  constructor(
    @InjectRepository(JobSeeker)
    private jobPreferenceRepository: Repository<JobSeeker>,
  ) {}

  async findAllJobPreferences(): Promise<JobSeeker[]> {
    return this.jobPreferenceRepository.find();
  }

  async findOneJobPreference(jobPreferenceId: number): Promise<JobSeeker> {
    return await this.jobPreferenceRepository.findOneBy({
      jobPreferenceId: jobPreferenceId,
    });
  }

  async createJobPreference(
    jobPreferenceDetails: JobSeekerDetailDto,
  ): Promise<JobSeeker> {
    const newJobPreference = this.jobPreferenceRepository.create({
      ...jobPreferenceDetails,
    });
    return this.jobPreferenceRepository.save(newJobPreference);
  }

  async deleteJobPreference(jobPreferenceId: number): Promise<void> {
    const jobPreference = await this.jobPreferenceRepository.findOneBy({
      jobPreferenceId: jobPreferenceId,
    });
    await this.jobPreferenceRepository.remove(jobPreference);
  }

  async updateJobPreference(
    jobPreferenceId: number,
    userDetails: UpdateJobSeekerDto,
  ): Promise<JobSeeker> {
    const updateResult = await this.jobPreferenceRepository.update(
      { jobPreferenceId },
      { ...userDetails },
    );
    const updatedJobPreference: JobSeeker =
      await this.jobPreferenceRepository.findOneBy({
        jobPreferenceId: jobPreferenceId,
      });
    return updatedJobPreference;
  }
}

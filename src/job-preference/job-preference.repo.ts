import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JobPreference } from 'src/entities/jobPreference.entity';
import { JobPreferenceDetailDto } from './dto/job-preference-detail.dto';
import { UpdateJobPreferenceDto } from './dto/update-job-preference.dto';

@Injectable()
export class JobPreferenceRepo {
  constructor(
    @InjectRepository(JobPreference)
    private jobPreferenceRepository: Repository<JobPreference>,
  ) {}

  async findAllJobPreferences(): Promise<JobPreference[]> {
    return this.jobPreferenceRepository.find();
  }

  async findOneJobPreference(jobPreferenceId: number): Promise<JobPreference> {
    return await this.jobPreferenceRepository.findOneBy({
      jobPreferenceId: jobPreferenceId,
    });
  }

  async createJobPreference(
    jobPreferenceDetails: JobPreferenceDetailDto,
  ): Promise<JobPreference> {
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
    userDetails: UpdateJobPreferenceDto,
  ): Promise<JobPreference> {
    const updateResult = await this.jobPreferenceRepository.update(
      { jobPreferenceId },
      { ...userDetails },
    );
    const updatedJobPreference: JobPreference =
      await this.jobPreferenceRepository.findOneBy({
        jobPreferenceId: jobPreferenceId,
      });
    return updatedJobPreference;
  }
}

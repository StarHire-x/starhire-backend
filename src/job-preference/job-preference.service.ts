import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobPreferenceDto } from './dto/create-job-preference.dto';
import { UpdateJobPreferenceDto } from './dto/update-job-preference.dto';
import { JobPreferenceRepo } from './job-preference.repo';

@Injectable()
export class JobPreferenceService {
  constructor(private readonly jobPreferenceRepo: JobPreferenceRepo) {}

  async create(createJobPreference: CreateJobPreferenceDto) {
    try {
      const { ...jobPreferenceDetail } = createJobPreference;
      return await this.jobPreferenceRepo.createJobPreference(
        jobPreferenceDetail,
      );
    } catch (err) {
      throw new ConflictException(
        'Inserting a duplicate entry into the database. Please check your data.',
      );
    }
  }

  async findAll() {
    return await this.jobPreferenceRepo.findAllJobPreferences();
  }

  async findOne(id: number) {
    const jobPreference = await this.jobPreferenceRepo.findOneJobPreference(id);
    if (jobPreference === null) {
      throw new NotFoundException(`Job Preference with ID ${id} not found`);
    } else {
      return jobPreference;
    }
  }

  async update(id: number, updateJobPreference: UpdateJobPreferenceDto) {
    const jobPreference = await this.jobPreferenceRepo.findOneJobPreference(id);
    if (jobPreference === null) {
      throw new NotFoundException(
        `Job Preference with ID ${id} not found, Update Unsuccessful`,
      );
    } else {
      return await this.jobPreferenceRepo.updateJobPreference(
        id,
        updateJobPreference,
      );
    }
  }

  async remove(id: number) {
    const jobPreference = await this.jobPreferenceRepo.findOneJobPreference(id);
    if (jobPreference === null) {
      throw new NotFoundException(
        `Job Preference with ID ${id} not found, Delete Unsuccessful`,
      );
    } else {
      return await this.jobPreferenceRepo.deleteJobPreference(id);
    }
  }
}

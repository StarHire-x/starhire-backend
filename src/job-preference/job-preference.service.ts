import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobPreferenceDto } from './dto/create-job-preference.dto';
import { UpdateJobPreferenceDto } from './dto/update-job-preference.dto';
import { JobPreferenceRepo } from './job-preference.repo';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class AdministratorService {
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
    const administrator = await this.jobPreferenceRepo.findOneJobPreference(id);
    if (administrator === null) {
      throw new NotFoundException(`User with ID ${id} not found`);
    } else {
      return administrator;
    }
  }

  async update(id: number, updateUser: UpdateJobPreferenceDto) {
    const user = await this.jobPreferenceRepo.findOneJobPreference(id);
    if (user === null) {
      throw new NotFoundException(
        `User with ID ${id} not found, Update Unsuccessful`,
      );
    } else {
      return await this.jobPreferenceRepo.updateJobPreference(id, updateUser);
    }
  }

  async remove(id: number) {
    const user = await this.jobPreferenceRepo.findOneJobPreference(id);
    if (user === null) {
      throw new NotFoundException(
        `User with ID ${id} not found, Delete Unsuccessful`,
      );
    } else {
      return await this.jobPreferenceRepo.deleteJobPreference(id);
    }
  }
}

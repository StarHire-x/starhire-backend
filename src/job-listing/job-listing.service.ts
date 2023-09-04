import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobListingDto } from './dto/create-job-listing.dto';
import { UpdateJobListingDto } from './dto/update-job-listing.dto';
import { JobListing } from 'src/entities/jobListing.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';
import { JobApplication } from 'src/entities/jobApplication.entity';
@Injectable()
export class JobListingService {
  constructor(
    @InjectRepository(JobListing)
    private readonly jobListingRepository: Repository<JobListing>,
  ) {}

  async create(createJobListingDto: CreateJobListingDto) {
    try {
      const { jobApplications, ...dtoExcludeRelationship } =
        createJobListingDto;

      const jobListing = new JobListing(dtoExcludeRelationship);

      jobListing.jobListingStatus = this.mapJsonToEnum(
        createJobListingDto.jobListingStatus,
      );

      // Creating the Classes for external relationship with other entities (OneToMany)
      if (createJobListingDto.jobApplications.length > 0) {
        const createJobApplications = createJobListingDto.jobApplications.map(
          (createJobApplicationDto) => {
            const { documents, ...dtoExcludeRelationship } =
              createJobApplicationDto;
            return new JobApplication(dtoExcludeRelationship);
          },
        );
        jobListing.jobApplications = createJobApplications;
      }
      return await this.jobListingRepository.save(jobListing);
    } catch (err) {
      throw new HttpException(
        'Failed to create new job listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.jobListingRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.jobListingRepository.findOne({
        where: { jobListingId: id },
        relations: { jobApplications: true },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateJobListingDto: UpdateJobListingDto) {
    try {
      const jobListing = await this.jobListingRepository.findOneBy({
        jobListingId: id,
      });

      const { jobApplications, ...dtoExcludeRelationship } =
        updateJobListingDto;
      Object.assign(jobListing, dtoExcludeRelationship);

      jobListing.jobListingStatus = this.mapJsonToEnum(
        updateJobListingDto.jobListingStatus,
      );

      if (jobApplications && jobApplications.length > 0) {
        const updatedJobApplication = updateJobListingDto.jobApplications.map(
          (createJobApplicationDto) => {
            const { documents, ...dtoExcludeRelationship } =
              createJobApplicationDto;
            return new JobApplication(dtoExcludeRelationship);
          },
        );
        jobListing.jobApplications = updatedJobApplication;
      }

      return await this.jobListingRepository.save(jobListing);
    } catch (err) {
      throw new HttpException(
        'Failed to update job listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
    try {
      return await this.jobListingRepository.delete({ jobListingId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete job listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  mapJsonToEnum(status: string): JobListingStatusEnum {
    switch (status) {
      case 'Inactive':
        return JobListingStatusEnum.INACTIVE;
      default:
        return JobListingStatusEnum.ACTIVE;
    }
  }
}

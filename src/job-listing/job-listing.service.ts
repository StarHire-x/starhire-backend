import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateJobListingDto } from './dto/create-job-listing.dto';
import { UpdateJobListingDto } from './dto/update-job-listing.dto';
import { JobListing } from 'src/entities/job-listing.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';;

@Injectable()
export class JobListingService {
  constructor(
    @InjectRepository(JobListing)
    private readonly jobListingRepository: Repository<JobListing>,
  ) {}

  async create(createJobListingDto: CreateJobListingDto) {
    try {
      const jobListing = new JobListing(createJobListingDto);

      jobListing.jobListingStatus = this.mapJsonToEnum(createJobListingDto.jobListingStatus);

      console.log(jobListing);
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
        relations: { jobApplication: true },
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
      Object.assign(jobListing, updateJobListingDto);

      jobListing.jobListingStatus = this.mapJsonToEnum(
        updateJobListingDto.jobListingStatus,
      );

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

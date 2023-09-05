import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobListingDto } from './dto/create-job-listing.dto';
import { UpdateJobListingDto } from './dto/update-job-listing.dto';
import { JobListing } from 'src/entities/jobListing.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';
import { Corporate } from 'src/entities/corporate.entity';
@Injectable()
export class JobListingService {
  constructor(
    @InjectRepository(JobListing)
    private readonly jobListingRepository: Repository<JobListing>,
    // Parent Entity
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
  ) {}

  async create(createJobListingDto: CreateJobListingDto) {
    try {
      // Ensure valid corporate Id is provided
      const corporate = await this.corporateRepository.findOne({
        where: { userId: createJobListingDto.corporateId },
      });
      if (!corporate) {
        throw new NotFoundException('Corporate Id provided is not valid');
      }

      // Ensure jobListingStatus field is a valid enum
      createJobListingDto.jobListingStatus = this.mapJsonToEnum(
        createJobListingDto.jobListingStatus,
      );

      // Create the job listing, establishing relationship to parent (corporate entity)
      const { corporateId, ...dtoExcludingParentId } = createJobListingDto;
      const jobListing = new JobListing({
        ...dtoExcludingParentId,
        corporate,
      });
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
        relations: { corporate: true, jobApplications: true },
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
      // Ensure valid job listing Id is provided
      const jobListing = await this.jobListingRepository.findOneBy({
        jobListingId: id,
      });
      if (!jobListing) {
        throw new NotFoundException('Job Listing Id provided is not valid');
      }

      // If jobListingStatus is to be updated, ensure it is a valid enum
      if (updateJobListingDto.jobListingStatus) {
        const mappedStatus = this.mapJsonToEnum(
          updateJobListingDto.jobListingStatus,
        );
        jobListing.jobListingStatus = mappedStatus;
      }
      Object.assign(jobListing, updateJobListingDto);
      return await this.jobListingRepository.save(jobListing);
    } catch (err) {
      throw new HttpException(
        'Failed to update job listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Note: Associated job listings will be removed as well, since cascade is set to true
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

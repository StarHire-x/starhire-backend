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
      const { corporateId, ...dtoExcludingParentId } = createJobListingDto;

      const corporate = await this.corporateRepository.findOne({
        where: { userId: corporateId },
      });
      if (!corporate) {
        throw new NotFoundException('Corporate Id provided is not valid');
      }

      // Ensure jobListingStatus field is a valid enum
      const mappedStatus = this.mapJsonToEnum(
        createJobListingDto.jobListingStatus,
      );
      createJobListingDto.jobListingStatus = mappedStatus;

      // Create the job listing, establishing relationship to parent (corporate entity)
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

  // Note: No child entities are returned, since it is not specified in the relations field
  async findAll() {
    return await this.jobListingRepository.find();
  }

  // Note: Associated parent and child entities will be returned as well, since they are specified in the relations field
  async findOne(id: number) {
    try {
      return await this.jobListingRepository.findOne({
        where: { jobListingId: id },
        relations: { corporate: true, jobApplications: true },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find job Listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Note: Since jobListingId is provided as a req param, there is no need to include it in the req body (dto object)
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
        updateJobListingDto.jobListingStatus = mappedStatus;
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

  // Note: Associated child entities(job Applications) will be removed as well, since cascade is set to true in the entity class
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

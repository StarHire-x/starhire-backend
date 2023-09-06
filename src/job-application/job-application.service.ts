import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { Repository } from 'typeorm';
import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';
import { JobListing } from 'src/entities/jobListing.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { Recruiter } from 'src/entities/recruiter.entity';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
    // Inject parent repositories
    @InjectRepository(JobListing)
    private readonly jobListingRepository: Repository<JobListing>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
  ) {}

  async create(createJobApplicationDto: CreateJobApplicationDto) {
    try {
      const { jobListingId, jobSeekerId, recruiterId, ...dtoExcludingParents } =
        createJobApplicationDto;
      // Ensure valid Parent Ids are provided
      const jobListing = await this.jobListingRepository.findOne({
        where: { jobListingId: jobListingId },
      });
      if (!jobListing) {
        throw new NotFoundException('Job Listing Id provided is not valid');
      }
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: jobSeekerId },
      });
      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }
      const recruiter = await this.recruiterRepository.findOne({
        where: { userId: recruiterId },
      });
      if (!recruiter) {
        throw new NotFoundException('Recruiter Id provided is not valid');
      }

      // Ensure jobApplicationStatus field is a valid enum
      const mappedStatus = this.mapJsonToEnum(
        createJobApplicationDto.jobApplicationStatus,
      );
      createJobApplicationDto.jobApplicationStatus = mappedStatus;

      // Create the job Application, establishing relationships to parents
      const jobApplication = new JobApplication({
        ...dtoExcludingParents,
        jobListing,
        jobSeeker,
        recruiter,
      });

      return await this.jobApplicationRepository.save(jobApplication);
    } catch (err) {
      throw new HttpException(
        'Failed to create new job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Note: No child entities are returned, since it is not specified in the relations field
  async findAll() {
    return await this.jobApplicationRepository.find();
  }

  // Only the child entity (document) is eagerly loaded
  async findOne(id: number) {
    try {
      return await this.jobApplicationRepository.findOne({
        where: { jobApplicationId: id },
        relations: { documents: true },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Note: Since jobApplicationId is provided as a req param, there is no need to include it in the req body (dto object)
  async update(id: number, updateJobApplicationDto: UpdateJobApplicationDto) {
    try {
      // Ensure valid Job Application Id is provided
      const jobApplication = await this.jobApplicationRepository.findOneBy({
        jobApplicationId: id,
      });

      if (!jobApplication) {
        throw new NotFoundException('Job Application Id provided is invalid');
      }

      // If jobApplicationStatus is to be updated, ensure it is a valid enum
      if (updateJobApplicationDto.jobApplicationStatus) {
        const mappedStatus = this.mapJsonToEnum(
          updateJobApplicationDto.jobApplicationStatus,
        );
        updateJobApplicationDto.jobApplicationStatus = mappedStatus;
      }
      Object.assign(jobApplication, updateJobApplicationDto);
      return await this.jobApplicationRepository.save(jobApplication);
    } catch (err) {
      throw new HttpException(
        'Failed to update job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Note: Associated child entities (Documents) will be removed as well, since cascade is set to true in the entity class
  async remove(id: number) {
    try {
      return await this.jobApplicationRepository.delete({
        jobApplicationId: id,
      });
    } catch (err) {
      throw new HttpException(
        'Failed to delete job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  mapJsonToEnum(status: string): JobApplicationStatusEnum {
    switch (status) {
      case 'Withdraw':
        return JobApplicationStatusEnum.WITHDRAWN;
      case 'Submitted':
        return JobApplicationStatusEnum.SUBMITTED;
      case 'Approved':
        return JobApplicationStatusEnum.ACCEPTED;
      case 'Rejected':
        return JobApplicationStatusEnum.REJECTED;
      default:
        return JobApplicationStatusEnum.PENDING;
    }
  }
}

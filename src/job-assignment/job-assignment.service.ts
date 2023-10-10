import { CreateJobAssignmentDto } from './dto/create-job-assignment.dto';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { JobAssignment } from 'src/entities/jobAssignment.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobListing } from 'src/entities/jobListing.entity';
import { Recruiter } from 'src/entities/recruiter.entity';

@Injectable()
export class JobAssignmentService {
  constructor(
    @InjectRepository(JobAssignment)
    private readonly jobAssignmentRepository: Repository<JobAssignment>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(JobListing)
    private readonly jobListingRepository: Repository<JobListing>,
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
  ) {}

  async create(createJobAssignmentDto: CreateJobAssignmentDto) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: createJobAssignmentDto.jobSeekerId }
      });

      if (!jobSeeker) {
        throw new HttpException(`Provided job seeker id ${createJobAssignmentDto.jobSeekerId} not found!`, 404);
      }

      const jobListing= await this.jobListingRepository.findOne({
        where: { jobListingId: createJobAssignmentDto.jobListingId }
      });

      if (!jobListing) {
        throw new HttpException(`Provided job listing id ${createJobAssignmentDto.jobListingId} not found!`, 404);
      }
      
      const recruiter = await this.recruiterRepository.findOne({
        where: { userId: createJobAssignmentDto.recruiterId }
      });

      if (!recruiter) {
        throw new HttpException(`Provided recruiter id ${createJobAssignmentDto.recruiterId} not found!`, 404);
      }
      
      const jobAssignment= new JobAssignment();
      jobAssignment.jobListingId = jobListing.jobListingId;
      jobAssignment.jobSeekerId = jobSeeker.userId;
      jobAssignment.recruiterId = recruiter.userId;

      await this.jobAssignmentRepository.save(jobAssignment);

      return {
        statusCode: HttpStatus.OK,
        message: 'Job Assignment created',
        data: jobAssignment,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    const t = await this.jobAssignmentRepository.find();
    if (t) {
      return t;
    } else {
      throw new HttpException(
        'Failed to find job assignments',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findByJobListingId(jobListingId: number) {
    const response = await this.jobAssignmentRepository.find({
      where: {jobListingId: jobListingId}
    });
    if (response) {
      return response;
    } else {
      throw new HttpException(
        'Failed to find job assignments',
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async findOneByJobSeekerId(jobSeekerId: string) {
    try {
      const t = await this.jobAssignmentRepository.find({
        where: { jobSeekerId: jobSeekerId },
      });
      if (t) {
        return t;
      } else {
        throw new HttpException(
          'Failed to find job assignment',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (err) {
      throw new HttpException(
        'Failed to find job assignment',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
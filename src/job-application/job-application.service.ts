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
import { JobListing } from 'src/entities/jobListing.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { mapJobApplicationStatusToEnum } from 'src/common/mapStringToEnum';
import { JobAssignment } from 'src/entities/jobAssignment.entity';
import { Document } from 'src/entities/document.entity';


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
    @InjectRepository(JobAssignment)
    private readonly jobAssignmentRepository: Repository<JobAssignment>,
  ) {}

  async create(createJobApplicationDto: CreateJobApplicationDto) {
    try {
      const { jobListingId, jobSeekerId, documents, ...dtoExcludingParents } =
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

      const recruiterReference = await this.jobAssignmentRepository.findOne({
        where: { jobSeekerId: jobSeekerId, jobListingId: jobListingId },
      });
      
      const recruiter = await this.recruiterRepository.findOne({
        where: { userId: recruiterReference.recruiterId },
      });

      if (!recruiter) {
        throw new NotFoundException('Recruiter Id provided is not valid');
      }

      // Ensure jobApplicationStatus field is a valid enum
      const mappedStatus = mapJobApplicationStatusToEnum(
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

      if (documents && documents.length > 0) {
        const updatedDocuments = documents.map((createDocumentDto) => {
          return new Document(createDocumentDto);
        });
        jobApplication.documents = updatedDocuments;
      }

      console.log(jobApplication);

      await this.jobApplicationRepository.save(jobApplication);

      return {
        statusCode: HttpStatus.OK,
        message: 'Job Application successfully created',
        data: jobApplication,
      }
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

  async findAllByJobListingId(id: number): Promise<JobApplication[]> {
    try {
      return await this.jobApplicationRepository.find({
        where: { jobListing: { jobListingId: id } },
        relations: { jobSeeker: true }, // to retrieve jobSeeker details with job application
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find job application by job listing id.',
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
        const mappedStatus = mapJobApplicationStatusToEnum(
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

  async getJobApplicationByJobSeekerJobListing(jobSeekerId: string, jobListingId: number) {
    try {
      const jobApplication = await this.jobApplicationRepository
        .createQueryBuilder('jobApplications')
        .where('jobApplications.userId = :userId', { userId: jobSeekerId })
        .andWhere('jobApplications.jobListingId = :jobListingId', {
          jobListingId: jobListingId,
        })
        .getOne();

      console.log(jobApplication);
      
      if(jobApplication) {
        return {
          statusCode: HttpStatus.OK,
          message: "Existing job application is found",
          data: jobApplication
        }
      } else {
        throw new HttpException(
          'No Job applicatione found in job listing',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        'No Job applicationy found in job listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getJobSeekersByJobApplicatonId(jobAppliationId: number) {
    try {
      const jobApplication = await this.jobApplicationRepository.findOne({
        where: { jobApplicationId: jobAppliationId },
        relations: ['jobSeeker', 'recruiter'],
      });

      if (jobApplication) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job Seekers has ben found',
          data: jobApplication,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Unable to find job Seekers',
        };
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to find job Seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { JobApplication } from '../entities/jobApplication.entity';
import { IsNull, Repository } from 'typeorm';
import { JobListing } from '../entities/jobListing.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { Recruiter } from '../entities/recruiter.entity';
import { mapJobApplicationStatusToEnum } from '../common/mapStringToEnum';
import { JobAssignment } from '../entities/jobAssignment.entity';
import { Document } from '../entities/document.entity';
import { EmailService } from '../email/email.service';
import { TwilioService } from '../twilio/twilio.service';
import NotificationModeEnum from '../enums/notificationMode.enum';
import JobApplicationStatusEnum from '../enums/jobApplicationStatus.enum';
import CommissionStatusEnum from '../enums/commissionStatus.enum';

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
    @InjectRepository(Document)
    private readonly documentRepository: Repository<Document>,
    private emailService: EmailService,
    private twilioService: TwilioService,
  ) {}

  async create(createJobApplicationDto: CreateJobApplicationDto) {
    try {
      const { jobListingId, jobSeekerId, documents, ...dtoExcludingParents } =
        createJobApplicationDto;

      // Ensure valid Parent Ids are provided
      const jobListing = await this.jobListingRepository.findOne({
        where: { jobListingId: jobListingId },
        relations: { corporate: true },
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

      const corporate = jobListing.corporate;

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

      if (jobSeeker.notificationMode === NotificationModeEnum.EMAIL) {
        this.emailService.notifyJobSeekerOnApplicationStatus(
          jobSeeker,
          jobApplication,
          jobListing,
          corporate,
          recruiter,
        );
      } else if (jobSeeker.notificationMode === NotificationModeEnum.SMS) {
        this.twilioService.notifyJobSeekerOnApplicationStatus(
          jobSeeker,
          jobApplication,
          jobListing,
          corporate,
          recruiter,
        );
      }

      if (recruiter.notificationMode === NotificationModeEnum.EMAIL) {
        this.emailService.notifyRecruiterOnApplicationStatus(
          recruiter,
          jobSeeker,
          jobApplication,
          jobListing,
          corporate,
        );
      } else if (recruiter.notificationMode === NotificationModeEnum.SMS) {
        this.twilioService.notifyRecruiterOnApplicationStatus(
          recruiter,
          jobSeeker,
          jobApplication,
          jobListing,
          corporate,
        );
      }

      //We don't send corporate cos recrutier need to see whether the stuff submitted by job seeker is valid anot

      return {
        statusCode: HttpStatus.OK,
        message: 'Job Application successfully created',
        data: jobApplication,
      };
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

  async findAllYetCommissionedSuccessfulJobAppsByRecruiterId(userId: string) {
    try {
      const jobApplications = await this.jobApplicationRepository.find({
        where: {
          recruiter: { userId: userId },
          jobApplicationStatus: JobApplicationStatusEnum.OFFER_ACCEPTED,
          commission: IsNull(),
        },
        relations: {
          jobListing: true,
        },
      });

      if (jobApplications.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Existing job applications are found',
          data: jobApplications,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No job applications is found for recruiters',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to find job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Only the child entity (document) is eagerly loaded
  async findOne(id: number) {
    try {
      return await this.jobApplicationRepository.findOne({
        where: { jobApplicationId: id },
        relations: {
          documents: true,
          jobSeeker: true,
          jobListing: true,
          recruiter: true,
        },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllByJobListingId(
    jobListingId: number,
    recruiterId: string,
  ): Promise<JobApplication[]> {
    try {
      return await this.jobApplicationRepository.find({
        where: {
          jobListing: { jobListingId: jobListingId },
          recruiter: { userId: recruiterId },
        },
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
      const jobApplication = await this.jobApplicationRepository.findOne({
        where: { jobApplicationId: id },
        relations: { jobSeeker: true, recruiter: true, jobListing: true },
      });

      const originalStatus = jobApplication.jobApplicationStatus;

      const jobListing = await this.jobListingRepository.findOne({
        where: { jobListingId: jobApplication.jobListing.jobListingId },
        relations: { corporate: true },
      });

      const corporate = jobListing.corporate;
      const jobSeeker = jobApplication.jobSeeker;
      const recruiter = jobApplication.recruiter;

      if (!jobApplication) {
        throw new NotFoundException('Job Application Id provided is invalid');
      }

      const { documents, ...dtoExcludeRelationship } = updateJobApplicationDto;

      Object.assign(jobApplication, dtoExcludeRelationship);

      // If jobApplicationStatus is to be updated, ensure it is a valid enum
      if (updateJobApplicationDto.jobApplicationStatus) {
        const mappedStatus = mapJobApplicationStatusToEnum(
          updateJobApplicationDto.jobApplicationStatus,
        );
        jobApplication.jobApplicationStatus = mappedStatus;
      }

      if (documents && documents.length > 0) {
        const updatedDocuments = documents.map((updateDocumentsDto) => {
          return new Document(updateDocumentsDto);
        });
        jobApplication.documents = updatedDocuments;
      }

      await this.jobApplicationRepository.save(jobApplication);

      if (jobSeeker.notificationMode === NotificationModeEnum.EMAIL) {
        this.emailService.notifyJobSeekerOnApplicationStatus(
          jobSeeker,
          jobApplication,
          jobListing,
          corporate,
          recruiter,
        );
      } else if (jobSeeker.notificationMode === NotificationModeEnum.SMS) {
        this.twilioService.notifyJobSeekerOnApplicationStatus(
          jobSeeker,
          jobApplication,
          jobListing,
          corporate,
          recruiter,
        );
      }

      if (recruiter.notificationMode === NotificationModeEnum.EMAIL) {
        this.emailService.notifyRecruiterOnApplicationStatus(
          recruiter,
          jobSeeker,
          jobApplication,
          jobListing,
          corporate,
        );
      } else if (recruiter.notificationMode === NotificationModeEnum.SMS) {
        this.twilioService.notifyRecruiterOnApplicationStatus(
          recruiter,
          jobSeeker,
          jobApplication,
          jobListing,
          corporate,
        );
      }

      if (corporate.notificationMode === NotificationModeEnum.EMAIL) {
        if (
          jobApplication.jobApplicationStatus ===
          JobApplicationStatusEnum.PROCESSING
        ) {
          this.emailService.notifyCorporateOnNewApplication(
            corporate,
            jobSeeker,
            jobApplication,
            jobListing,
            recruiter,
          );
        } else if (
          jobApplication.jobApplicationStatus !==
            JobApplicationStatusEnum.SUBMITTED &&
          jobApplication.jobApplicationStatus !==
            JobApplicationStatusEnum.TO_BE_SUBMITTED
        ) {
          this.emailService.notifyCorporateOnApplicationStatus(
            corporate,
            jobSeeker,
            jobApplication,
            jobListing,
            recruiter,
          );
        }
      } else if (corporate.notificationMode === NotificationModeEnum.SMS) {
        if (
          jobApplication.jobApplicationStatus ===
          JobApplicationStatusEnum.PROCESSING
        ) {
          this.twilioService.notifyCorporateOnNewApplication(
            corporate,
            jobSeeker,
            jobApplication,
            jobListing,
            recruiter,
          );
        } else if (
          jobApplication.jobApplicationStatus !==
            JobApplicationStatusEnum.SUBMITTED &&
          jobApplication.jobApplicationStatus !==
            JobApplicationStatusEnum.TO_BE_SUBMITTED
        ) {
          this.twilioService.notifyCorporateOnApplicationStatus(
            corporate,
            jobSeeker,
            jobApplication,
            jobListing,
            recruiter,
          );
        }
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Job Application successfully updated',
        data: jobApplication,
      };
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

  async getJobApplicationByJobSeeker(jobSeekerId: string) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: jobSeekerId },
        relations: { jobApplications: true },
      });

      if (!jobSeeker) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Invalid Job Seeker ID provided',
        };
      }

      if (jobSeeker.jobApplications.length === 0) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'No job application is found for job seeker',
        };
      }

      const jobApplications = await this.jobApplicationRepository.find({
        where: { jobSeeker: jobSeeker },
        relations: { jobListing: true },
      });

      return {
        statusCode: HttpStatus.OK,
        message: 'Existing job application is found',
        data: jobApplications,
      };
    } catch (error) {
      throw new HttpException(
        'No Job application is found',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getJobApplicationByJobSeekerJobListing(
    jobSeekerId: string,
    jobListingId: number,
  ) {
    try {
      const jobApplication = await this.jobApplicationRepository.findOne({
        where: {
          jobSeeker: { userId: jobSeekerId },
          jobListing: { jobListingId: jobListingId },
        },
        relations: { jobSeeker: true, jobListing: true },
      });

      if (jobApplication) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Existing job application found',
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Existing job application not found',
        };
      }
    } catch (error) {
      throw new HttpException(
        'No Job application found in job listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getJobSeekersByJobApplicatonId(jobAppliationId: number) {
    try {
      const jobApplication = await this.jobApplicationRepository.findOne({
        where: { jobApplicationId: jobAppliationId },
        relations: ['jobSeeker', 'recruiter', 'documents', 'jobListing'],
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

  async getJobApplicationById(jobAppliationId: number) {
    try {
      const jobApplication = await this.jobApplicationRepository.findOne({
        where: { jobApplicationId: jobAppliationId },
      });

      if (jobApplication) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job Application found',
          data: jobApplication,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Unable to find job application',
        };
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to find job application',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

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
import JobApplicationStatusEnum from 'src/enums/jobApplicationStatus.enum';
import { Corporate } from 'src/entities/corporate.entity';
import { mapJobListingStatusToEnum } from 'src/common/mapStringToEnum';
import { JobApplication } from 'src/entities/jobApplication.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { Recruiter } from 'src/entities/recruiter.entity';
import { JobAssignment } from 'src/entities/jobAssignment.entity';
import { EmailService } from 'src/email/email.service';
import { TwilioService } from 'src/twilio/twilio.service';
import NotificationModeEnum from 'src/enums/notificationMode.enum';
import { Administrator } from 'src/entities/administrator.entity';

@Injectable()
export class JobListingService {
  constructor(
    @InjectRepository(JobListing)
    private readonly jobListingRepository: Repository<JobListing>,
    // Parent Entity
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
    @InjectRepository(Corporate)
    private readonly jobApplicationRepository: Repository<JobApplication>,
    @InjectRepository(JobAssignment)
    private readonly jobAssignmentRepository: Repository<JobAssignment>,
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
    private emailService: EmailService,
    private twilioService: TwilioService,
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

      // Ensure jobStartDate is a future date
      if (createJobListingDto.jobStartDate <= new Date()) {
        throw new HttpException(
          'Job start date must be a future date.',
          HttpStatus.BAD_REQUEST,
        );
      }

      // Ensure jobListingStatus field is a valid enum
      const mappedStatus = mapJobListingStatusToEnum(
        createJobListingDto.jobListingStatus,
      );
      createJobListingDto.jobListingStatus = mappedStatus;

      // Create the job listing, establishing relationship to parent (corporate entity)
      const jobListing = new JobListing({
        ...dtoExcludingParentId,
        corporate,
      });
      await this.jobListingRepository.save(jobListing);

      const adminList = await this.administratorRepository.find();
      adminList.map((admin) => {
        if (admin.notificationMode === NotificationModeEnum.EMAIL) {
          this.emailService.notifyAdminOnNewJobListing(
            admin,
            corporate,
            jobListing,
          );
        } else if (admin.notificationMode === NotificationModeEnum.SMS) {
          this.twilioService.notifyAdminOnNewJobListing(
            admin,
            corporate,
            jobListing,
          );
        }
      });

      if (jobListing) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job listing created',
          data: jobListing,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job listing failed to be created',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to create new job listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // Note: No child entities are returned, since it is not specified in the relations field
  async findAll() {
    const t = await this.jobListingRepository.find({
      relations: {
        corporate: true,
        jobApplications: { recruiter: true },
        jobSeekers: true,
      },
    });
    //console.log(t);
    return t;
  }

  async findAllByCorporate(id: string) {
    // Find the corporate using the provided user ID
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { userId: id },
        relations: { jobListings: true },
      });

      if (!corporate) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job listing not found',
          data: [],
        };
      }

      // Fetch job listings that belong to the found corporate
      console.log(corporate.jobListings);
      return {
        statusCode: HttpStatus.OK,
        message: 'Job listing found',
        data: corporate.jobListings,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Note: Associated parent and child entities will be returned as well, since they are specified in the relations field
  async findOne(id: number) {
    try {
      const t = await this.jobListingRepository.findOne({
        where: { jobListingId: id },
        relations: { corporate: true, jobApplications: true, jobSeekers: true },
      });
      console.log(t);
      return t;
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
      const jobListing = await this.jobListingRepository.findOne({
        where: { jobListingId: id },
        relations: { corporate: true },
      });
      if (!jobListing) {
        throw new NotFoundException('Job Listing Id provided is not valid');
      }

      const corporate = jobListing.corporate;

      // If jobListingStatus is to be updated, ensure it is a valid enum
      if (updateJobListingDto.jobListingStatus) {
        const mappedStatus = mapJobListingStatusToEnum(
          updateJobListingDto.jobListingStatus,
        );
        updateJobListingDto.jobListingStatus = mappedStatus;
      }
      Object.assign(jobListing, updateJobListingDto);
      await this.jobListingRepository.save(jobListing);

      if (jobListing.jobListingStatus !== JobListingStatusEnum.UNVERIFIED) {
        if (corporate.notificationMode === NotificationModeEnum.EMAIL) {
          this.emailService.notifyCorporateOnJobListingStatus(
            corporate,
            jobListing,
          );
        } else if (corporate.notificationMode === NotificationModeEnum.SMS) {
          this.twilioService.notifyCorporateOnJobListingStatus(
            corporate,
            jobListing,
          );
        }
      }

      if (jobListing.jobListingStatus === JobListingStatusEnum.APPROVED) {
        const recruiterList = await this.recruiterRepository.find();
        recruiterList.map((recruiter) => {
          if (recruiter.notificationMode === NotificationModeEnum.EMAIL) {
            this.emailService.notifyRecruiterOnNewJobListing(
              recruiter,
              corporate,
              jobListing,
            );
          } else if (recruiter.notificationMode === NotificationModeEnum.SMS) {
            this.twilioService.notifyRecruiterOnNewJobListing(
              recruiter,
              corporate,
              jobListing,
            );
          }
        });
      }

      if (jobListing) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job listing updated',
          data: jobListing,
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to update job listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async assignJobListing(
    jobSeekerId: string,
    jobListingId: number,
    recruiterId: string,
  ) {
    try {
      // Ensure valid job listing Id is provided
      const jobListing = await this.findOne(jobListingId);

      if (!jobListing) {
        throw new NotFoundException('Job Listing Id provided is not valid');
      }

      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: jobSeekerId },
        relations: {
          jobListings: true,
        },
      });

      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker User ID provided is not valid');
      }

      const recruiter = await this.recruiterRepository.findOne({
        where: { userId: recruiterId },
      });

      if (!recruiter) {
        throw new NotFoundException('Recruiter User ID provided is not valid');
      }

      // add jobSeeker to jobListing's jobSeeker[].
      jobListing.jobSeekers.push(jobSeeker);
      await this.jobListingRepository.save(jobListing);

      // add jobListing to jobSeeker's jobListing[].
      jobSeeker.jobListings.push(jobListing);
      await this.jobSeekerRepository.save(jobSeeker);

      const jobAssignment = new JobAssignment();
      jobAssignment.jobListingId = jobListingId;
      jobAssignment.jobSeekerId = jobSeekerId;
      jobAssignment.recruiterId = recruiterId;
      await this.jobAssignmentRepository.save(jobAssignment);

      if (jobListing && jobSeeker && recruiter) {
        return {
          statusCode: HttpStatus.OK,
          message:
            'Job seeker has been assigned to Job listing and Job listing has been assigned to Job seeker',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to assign job seeker to job listing and failed to assign job listing to job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deassignJobListing(jobSeekerId: string, jobListingId: number) {
    try {
      const jobListing = await this.findOne(jobListingId);

      if (!jobListing) {
        throw new NotFoundException('Job Listing Id provided is not valid');
      }

      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: jobSeekerId },
        relations: {
          jobListings: true,
        },
      });

      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker User ID provided is not valid');
      }

      // remove jobSeeker from jobListing's jobSeeker[].
      const jobSeekerIndex = jobListing.jobSeekers.findIndex(
        (js) => js.userId === jobSeekerId,
      );
      if (jobSeekerIndex !== -1) {
        jobListing.jobSeekers.splice(jobSeekerIndex, 1);
        await this.jobListingRepository.save(jobListing);
      }

      // remove jobListing from jobSeeker's jobListing[].
      const jobListingIndex = jobSeeker.jobListings.findIndex(
        (jl) => jl.jobListingId === jobListingId,
      );
      if (jobListingIndex !== -1) {
        jobSeeker.jobListings.splice(jobListingIndex, 1);
        await this.jobSeekerRepository.save(jobSeeker);
      }

      // remove entry from JobAssignment table
      const jobAssignment = await this.jobAssignmentRepository.findOne({
        where: {
          jobListingId: jobListingId,
          jobSeekerId: jobSeekerId,
        },
      });
      if (jobAssignment) {
        await this.jobAssignmentRepository.remove(jobAssignment);
      }

      if (jobListing && jobSeeker) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker has been de-assigned from Job listing',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to de-assign job seeker from job listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllByJobSeeker(id: string): Promise<JobListing[]> {
    try {
      const jobListings = await this.jobListingRepository
        .createQueryBuilder('jobListing')
        .innerJoinAndSelect('jobListing.jobSeekers', 'jobSeeker')
        .innerJoinAndSelect('jobListing.corporate', 'corporate')
        .where('jobSeeker.userId = :userId', { userId: id })
        .getMany();

      if (!jobListings.length) {
        throw new NotFoundException(`No job listings found for user ID ${id}`);
      }

      return jobListings;
    } catch (error) {
      console.error('Error in findAllByJobSeeker: ', error);
      throw error; // Handle database or any other errors, you can further refine this part
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

  /*
  async getJobApplicationsByJobListingId(jobListingId: number) {
    try {
      const jobListing = await this.jobListingRepository.findOne({
        where: { jobListingId: jobListingId },
        relations: ['jobApplications'],
      });

      if (jobListing) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job Applications has ben found',
          data: jobListing.jobApplications,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Unable to find job applications',
        };
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to find job Listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
  */
  async getProcessingJobApplicationsByJobListingId(jobListingId: number) {
    try {
      const jobListing = await this.jobListingRepository.findOne({
        where: { jobListingId: jobListingId },
        relations: ['jobApplications'],
      });

      if (jobListing) {
        /*
        const processingJobApplications = jobListing.jobApplications.filter(
          (jobApplication) =>
            jobApplication.jobApplicationStatus === 'Processing',
        );
        */
        const processingJobApplications = jobListing.jobApplications.filter(
          (jobApplication) =>
            jobApplication.jobApplicationStatus !==
            JobApplicationStatusEnum.SUBMITTED,
        );
        return {
          statusCode: HttpStatus.OK,
          message: 'Processing Job Applications found',
          data: processingJobApplications,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Unable to find job applications',
        };
      }
    } catch (err) {
      console.log(err);
      throw new HttpException(
        'Failed to find job Listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Method for email
  async findJobListingWithCorporate(id: number) {
    try {
      const t = await this.jobListingRepository.findOne({
        where: { jobListingId: id },
        relations: { corporate: true },
      });
      console.log(t);
      return t;
    } catch (err) {
      throw new HttpException(
        'Failed to find job Listing',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

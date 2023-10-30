import { Recruiter } from 'src/entities/recruiter.entity';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  mapNotificationModeToEnum,
  mapUserRoleToEnum,
  mapUserStatusToEnum,
} from 'src/common/mapStringToEnum';
import { EmailService } from 'src/email/email.service';
import NotificationModeEnum from 'src/enums/notificationMode.enum';
import UserRoleEnum from 'src/enums/userRole.enum';
import { TwilioService } from 'src/twilio/twilio.service';
import { JobAssignment } from 'src/entities/jobAssignment.entity';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { JobListing } from 'src/entities/jobListing.entity';

@Injectable()
export class RecruiterService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
    private emailService: EmailService,
    private twilioService: TwilioService,
    @InjectRepository(JobAssignment)
    private readonly jobAssignmentRepository: Repository<JobAssignment>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(JobListing)
    private readonly jobListingRepository: Repository<JobListing>,
  ) {}

  async create(createRecruiterDto: CreateRecruiterDto) {
    try {
      const recruiter = new Recruiter({ ...createRecruiterDto });

      // Convert all ENUM values
      if (recruiter.status) {
        recruiter.status = mapUserStatusToEnum(recruiter.status);
      }
      if (recruiter.notificationMode) {
        recruiter.notificationMode = mapNotificationModeToEnum(
          recruiter.notificationMode,
        );
      }
      if (recruiter.role) {
        recruiter.role = mapUserRoleToEnum(recruiter.role);
      }

      await this.recruiterRepository.save(recruiter);

      if (recruiter) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Recruiter created',
          data: recruiter,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Recruiter failed to be created',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to create recruiter',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const recruiters = await this.recruiterRepository.find({
        relations: {
          jobApplications: {commission: true},
        }
      });
      if (recruiters.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Recruiter found',
          data: recruiters,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Recrutier not found',
          data: [],
        };
      }
    } catch {
      throw new HttpException(
        'Failed to find recruiter',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findRecrutierMatchingStatistics(userId: string) {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { userId },
        relations: [
          'jobApplications',
          'jobApplications.jobSeeker',
          'jobApplications.jobListing',
        ],
      });

      console.log('Hello');
      console.log(recruiter.jobApplications);

      const jobAssignments = await this.jobAssignmentRepository.find({
        where: { recruiterId: userId },
      });

      console.log(jobAssignments)

      let acceptanceRate;

      if (jobAssignments.length === 0) {
        acceptanceRate = 0;
      } else {
        acceptanceRate =
          (recruiter.jobApplications.length / jobAssignments.length) * 100;
      }

      const pendingResponse = jobAssignments.filter((jobAssignment) => {
        return !recruiter.jobApplications.some((jobApplication) => {
          return (
            jobApplication.jobListing.jobListingId ===
              jobAssignment.jobListingId &&
            jobApplication.jobSeeker.userId === jobAssignment.jobSeekerId
          );
        });
      });

      const acceptedResponse = jobAssignments.filter((jobAssignment) => {
        return recruiter.jobApplications.some((jobApplication) => {
          return (
            jobApplication.jobListing.jobListingId ===
              jobAssignment.jobListingId &&
            jobApplication.jobSeeker.userId === jobAssignment.jobSeekerId
          );
        });
      });

      let totalDuration = 0; // in milliseconds
      let count = acceptedResponse.length;

      acceptedResponse.forEach((jobAssignment) => {
        const correspondingJobApplication = recruiter.jobApplications.find(
          (jobApplication) => {
            return (
              jobApplication.jobListing.jobListingId ===
                jobAssignment.jobListingId &&
              jobApplication.jobSeeker.userId === jobAssignment.jobSeekerId
            );
          },
        );

        if (correspondingJobApplication) {
          console.log(correspondingJobApplication.submissionDate);
          console.log(jobAssignment.assignedTime);
          const duration =
            correspondingJobApplication.submissionDate.getTime() -
            jobAssignment.assignedTime.getTime();
          console.log(duration);
          totalDuration += duration;
        }
      });

      let duration;

      if(count === 0) {
        duration = 0;
      } else {
        duration = totalDuration / count;
      }

      const hours = Math.floor(duration / (1000 * 60 * 60));
      const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((duration % (1000 * 60)) / 1000);

      let formattedDuration = `${hours}hrs ${minutes}mins`;
      if (formattedDuration === '0hrs 0mins') {
        formattedDuration = 'N.A';
      }

      const formatResponse = await Promise.all(
        pendingResponse.map(async (jobAssignment) => {
          const jobSeeker = await this.jobSeekerRepository.findOne({
            where: { userId: jobAssignment.jobSeekerId },
          });

          const jobListing = await this.jobListingRepository.findOne({
            where: { jobListingId: jobAssignment.jobListingId },
            relations: ['corporate'],
          });

          return {
            jobAssignmentId: jobAssignment.jobAssignmentId,
            jobSeekerId: jobSeeker.userId,
            jobSeekerName: jobSeeker.fullName,
            jobSeekerProfilePic: jobSeeker.profilePictureUrl,
            corporateId: jobListing.corporate.userId,
            corporateName: jobListing.corporate.companyName,
            corporateProfilePic: jobListing.corporate.profilePictureUrl,
            jobListingId: jobListing.jobListingId,
            jobListingTitle: jobListing.title, 
          };
        }),
      );

      const result = {
        stats: {
          duration: formattedDuration,
          matched: jobAssignments.length,
          acceptanceRate: acceptanceRate.toFixed(2),
        },
        response: formatResponse,
      };

      return {
        statusCode: HttpStatus.OK,
        message: 'Statistics found',
        data: result,
      };
    } catch (err) {
      throw new HttpException(
        'Failed to find recruiter',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Added code to handle different request
  async findByEmail(email: string) {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { email },
      });

      if (recruiter) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Recruiter found',
          data: recruiter,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Recrutier not found',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to find recruiter',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Added code to handle different request
  async findByUserId(userId: string) {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { userId },
      });

      if (recruiter) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Recruiter found',
          data: recruiter,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Recrutier not found',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to find recruiter',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { userId: id },
        relations: {
          commissions: true,
          jobApplications: true,
          chats: true,
          tickets: true,
        },
      });
      return recruiter;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updatedRecruiter: UpdateRecruiterDto) {
    try {
      const recruiter = await this.recruiterRepository.findOneBy({
        userId: id,
      });

      if (!recruiter) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Recruiter id not found',
          data: [],
        };
      }

      const initialNotificationStatus = recruiter.notificationMode;

      Object.assign(recruiter, updatedRecruiter);

      if (updatedRecruiter.status) {
        recruiter.status = mapUserStatusToEnum(updatedRecruiter.status);
      }

      if (updatedRecruiter.notificationMode) {
        recruiter.notificationMode = mapNotificationModeToEnum(
          updatedRecruiter.notificationMode,
        );
      }

      await this.recruiterRepository.save(recruiter);

      if (
        initialNotificationStatus === NotificationModeEnum.SMS &&
        recruiter.notificationMode === NotificationModeEnum.EMAIL
      ) {
        await this.emailService.sendNotificationStatusEmail(
          recruiter,
          UserRoleEnum.RECRUITER,
        );
      } else if (
        initialNotificationStatus === NotificationModeEnum.EMAIL &&
        recruiter.notificationMode === NotificationModeEnum.SMS
      ) {
        await this.twilioService.sendNotificationStatusSMS(
          recruiter,
          UserRoleEnum.RECRUITER,
        );
      }

      if (recruiter) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Recruiter updated',
          data: recruiter,
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to update recruiter',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      return await this.recruiterRepository.delete({ userId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete a recruiter',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

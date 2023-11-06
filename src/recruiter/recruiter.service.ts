import { Recruiter } from '../entities/recruiter.entity';
import { CreateRecruiterDto } from './dto/create-recruiter.dto';
import { UpdateRecruiterDto } from './dto/update-recruiter.dto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  mapNotificationModeToEnum,
  mapUserRoleToEnum,
  mapUserStatusToEnum,
} from '../common/mapStringToEnum';
import { EmailService } from '../email/email.service';
import NotificationModeEnum from '../enums/notificationMode.enum';
import UserRoleEnum from '../enums/userRole.enum';
import { TwilioService } from '../twilio/twilio.service';
import { JobAssignment } from '../entities/jobAssignment.entity';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { JobListing } from '../entities/jobListing.entity';
import { JobApplication } from '../entities/jobApplication.entity';

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
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
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

      return {
        statusCode: HttpStatus.OK,
        message: 'Recruiter created',
        data: recruiter,
      };
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
          jobApplications: { commission: true },
        },
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

  async findRecruiterMatchingStatistics(userId: string) {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { userId },
        relations: [
          'jobApplications',
          'jobApplications.jobSeeker',
          'jobApplications.jobListing',
        ],
      });

      const jobAssignments = await this.jobAssignmentRepository.find({
        where: { recruiterId: userId },
      });

      console.log(jobAssignments);

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

      if (count === 0) {
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

      console.log(result.stats);
      console.log(result.response);

      return {
        statusCode: HttpStatus.OK,
        message: 'Statistics found',
        data: result,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
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
        },
      });
      return recruiter;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async getJobApplicationsForRecruiter(recruiterId: string) {
    try {
      const recruiter = await this.recruiterRepository.findOne({
        where: { userId: recruiterId },
        relations: {
          jobApplications: true,
        },
      });

      if (!recruiter) {
        throw new HttpException('Recruiter Id not found', HttpStatus.NOT_FOUND);
      }

      const predefinedStatuses = {
        Total: recruiter.jobApplications.length,
        Submitted: 0,
        Processing: 0,
        To_Be_Submitted: 0,
        Waiting_For_Interview: 0,
        Offer_Rejected: 0,
        Offer_Accepted: 0,
        Rejected: 0,
        Offered: 0,
      };

      const statusCount = recruiter.jobApplications.reduce(
        (acc, item) => {
          if (acc.hasOwnProperty(item.jobApplicationStatus)) {
            acc[item.jobApplicationStatus]++;
          }
          // Note: If the status doesn't match any predefined status, it's ignored.
          return acc;
        },
        { ...predefinedStatuses },
      );

      const formatResponse = await Promise.all(
        recruiter.jobApplications.map(async (jobApplication) => {
          const jobApplicationRef = await this.jobApplicationRepository.findOne(
            {
              where: { jobApplicationId: jobApplication.jobApplicationId },
              relations: ['jobSeeker', 'jobListing'],
            },
          );

          const jobListing = await this.jobListingRepository.findOne({
            where: { jobListingId: jobApplicationRef.jobListing.jobListingId },
            relations: ['corporate'],
          });

          return {
            jobApplicationId: jobApplication.jobApplicationId,
            jobApplicationStatus: jobApplication.jobApplicationStatus,
            jobSeekerId: jobApplicationRef.jobSeeker.userId,
            jobSeekerName: jobApplicationRef.jobSeeker.fullName,
            jobSeekerProfilePic: jobApplicationRef.jobSeeker.profilePictureUrl,
            corporateId: jobListing.corporate.userId,
            corporateName: jobListing.corporate.companyName,
            corporateProfilePic: jobListing.corporate.profilePictureUrl,
            jobListingId: jobListing.jobListingId,
            jobListingTitle: jobListing.title,
          };
        }),
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Statistics found',
        data: {
          statusCount,
          formatResponse,
        },
      };
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
      const result = await this.recruiterRepository.delete({ userId: id });
      if (result.affected === 0) {
        throw new HttpException('Recruiter id not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}

import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateJobSeekerDto } from './dto/create-job-seeker.dto';
import { UpdateJobSeekerDto } from './dto/update-job-seeker.dto';
import { JobSeeker } from '../entities/jobSeeker.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  mapEducationStatusToEnum,
  mapNotificationModeToEnum,
  mapUserRoleToEnum,
  mapUserStatusToEnum,
  mapVisibilityToEnum,
} from '../common/mapStringToEnum';
import { Public } from '../users/public.decorator';
import { EmailService } from '../email/email.service';
import UserRoleEnum from '../enums/userRole.enum';
import NotificationModeEnum from '../enums/notificationMode.enum';
import { TwilioService } from '../twilio/twilio.service';
import { Corporate } from '../entities/corporate.entity';
import { JobListing } from '../entities/jobListing.entity';

@Injectable()
export class JobSeekerService {
  constructor(
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
    @InjectRepository(JobListing)
    private readonly jobListingRepository: Repository<JobListing>,
    private emailService: EmailService,
    private twilioService: TwilioService,
  ) {}

  async create(createJobSeekerDto: CreateJobSeekerDto) {
    try {
      const jobSeeker = new JobSeeker({ ...createJobSeekerDto });

      // Convert all ENUM values
      if (jobSeeker.status) {
        jobSeeker.status = mapUserStatusToEnum(jobSeeker.status);
      }
      if (jobSeeker.notificationMode) {
        jobSeeker.notificationMode = mapNotificationModeToEnum(
          jobSeeker.notificationMode,
        );
      }
      if (jobSeeker.role) {
        jobSeeker.role = mapUserRoleToEnum(jobSeeker.role);
      }
      if (jobSeeker.highestEducationStatus) {
        jobSeeker.highestEducationStatus = mapEducationStatusToEnum(
          jobSeeker.highestEducationStatus,
        );
      }
      await this.jobSeekerRepository.save(jobSeeker);
      if (jobSeeker) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker created',
          data: jobSeeker,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job seeker failed to be created',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to create job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Added code to handle different request
  async findByEmail(email: string) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { email },
      });

      if (jobSeeker) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker found',
          data: jobSeeker,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job seeker not found',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to find job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Added code to handle different request
  async findByUserId(userId: string) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId },
        relations: {
          jobPreference: true,
          jobExperiences: true,
        },
      });

      if (jobSeeker) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker found',
          data: jobSeeker,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job seeker not found',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to find job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: id },
        relations: {
          forumComments: true,
          jobPreference: true,
          jobApplications: true,
          forumPosts: true,
          chats: true,
          tickets: true,
          jobListings: true,
          // reviews: true,
        },
      });
      if (jobSeeker) {
        return jobSeeker;
      } else {
        throw new HttpException(
          'Job seeker id not found',
          HttpStatus.NOT_FOUND,
        );
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findMyFollowings(id: string) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: id },
        relations: {
          following: true,
        },
      });

      if (jobSeeker) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Number of followings found',
          data: jobSeeker.following.length,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Following not found',
        };
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(id: string, updatedJobSeeker: UpdateJobSeekerDto) {
    try {
      const jobSeeker = await this.jobSeekerRepository.findOneBy({
        userId: id,
      });

      if (!jobSeeker) {
        throw new HttpException(
          'Job seeker id not found',
          HttpStatus.NOT_FOUND,
        );
      }

      const initialNotificationStatus = jobSeeker.notificationMode;

      Object.assign(jobSeeker, updatedJobSeeker);

      if (updatedJobSeeker.status) {
        jobSeeker.status = mapUserStatusToEnum(updatedJobSeeker.status);
      }

      if (updatedJobSeeker.notificationMode) {
        jobSeeker.notificationMode = mapNotificationModeToEnum(
          updatedJobSeeker.notificationMode,
        );
      }

      if (updatedJobSeeker.highestEducationStatus) {
        jobSeeker.highestEducationStatus = mapEducationStatusToEnum(
          updatedJobSeeker.highestEducationStatus,
        );
      }

      if (updatedJobSeeker.visibility) {
        jobSeeker.visibility = mapVisibilityToEnum(updatedJobSeeker.visibility);
      }

      await this.jobSeekerRepository.save(jobSeeker);

      if (
        initialNotificationStatus === NotificationModeEnum.SMS &&
        jobSeeker.notificationMode === NotificationModeEnum.EMAIL
      ) {
        await this.emailService.sendNotificationStatusEmail(
          jobSeeker,
          UserRoleEnum.JOBSEEKER,
        );
      } else if (
        initialNotificationStatus === NotificationModeEnum.EMAIL &&
        jobSeeker.notificationMode === NotificationModeEnum.SMS
      ) {
        await this.twilioService.sendNotificationStatusSMS(
          jobSeeker,
          UserRoleEnum.JOBSEEKER,
        );
      }

      if (jobSeeker) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker updated',
          data: jobSeeker,
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to update job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const jobSeekers = await this.jobSeekerRepository.find({
        relations: {
          chats: true,
          jobListings: true,
          jobPreference: true,
          jobExperiences: true,
        },
      });
      if (jobSeekers.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker found',
          data: jobSeekers,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job seeker not found',
          data: [],
        };
      }
    } catch {
      throw new HttpException(
        'Failed to find job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllWithSimilarity(jobListingId: number) {
    try {
      const jobSeekers = await this.jobSeekerRepository.find({
        relations: {
          chats: true,
          jobListings: true,
          jobPreference: true,
          jobExperiences: true,
        },
      });
      if (jobSeekers.length > 0) {
        const jobListing = await this.jobListingRepository.findOne({
          where: { jobListingId: jobListingId },
          relations: {
            corporate: true,
          },
        });

        const corporate = await this.corporateRepository.findOne({
          where: { userId: jobListing.corporate.userId },
          relations: {
            jobPreference: true,
          },
        });

        const jobSeekerWithSimilarity = await this.calculateSimilarity(
          jobSeekers,
          corporate,
        );

        console.log(jobSeekerWithSimilarity);

        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker found',
          data: jobSeekerWithSimilarity,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Job seeker not found',
          data: [],
        };
      }
    } catch {
      throw new HttpException(
        'Failed to find job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  getValueOrDefault = (value, defaultValue = 0) => {
    return value == null ? defaultValue : value; // using '==' will check for both null and undefined
  };

  async calculateSimilarity(jobSeekers: any[], corporate: Corporate) {
    const results = await Promise.all(
      jobSeekers.map(async (jobSeeker) => {
        let userBenefits =
          this.getValueOrDefault(jobSeeker.jobPreference?.benefitPreference) *
          20;
        let userWLBalance =
          this.getValueOrDefault(
            jobSeeker.jobPreference?.workLifeBalancePreference,
          ) * 20;
        let userSalary =
          this.getValueOrDefault(jobSeeker.jobPreference?.salaryPreference) *
          20;

        let corporatePreferenceRating = corporate.jobPreference;

        if (userBenefits === 0 && userWLBalance === 0 && userSalary === 0) {
          jobSeeker.similarity = 0.0;
          jobSeeker.corporatePreference = corporatePreferenceRating;
          return jobSeeker;
        }

        let corporateBenefits =
          this.getValueOrDefault(corporate.jobPreference?.benefitPreference) *
          20;
        let corporateWLBalance =
          this.getValueOrDefault(
            corporate.jobPreference?.workLifeBalancePreference,
          ) * 20;
        let corporateSalary =
          this.getValueOrDefault(corporate.jobPreference?.salaryPreference) *
          20;

        let dotProduct =
          userBenefits * corporateBenefits +
          userWLBalance * corporateWLBalance +
          userSalary * corporateSalary;

        let userMagnitude = Math.sqrt(
          Math.pow(userBenefits, 2) +
            Math.pow(userWLBalance, 2) +
            Math.pow(userSalary, 2),
        );
        let corporateMagnitude = Math.sqrt(
          Math.pow(corporateBenefits, 2) +
            Math.pow(corporateWLBalance, 2) +
            Math.pow(corporateSalary, 2),
        );

        // Ensure we don't divide by zero and handle NaN case
        let similarity: number;
        if (userMagnitude === 0 || corporateMagnitude === 0) {
          similarity = 0;
        } else {
          similarity = dotProduct / (userMagnitude * corporateMagnitude);
        }

        let percentageSimilarity = Number(
          (((similarity + 1) / 2) * 100).toFixed(2),
        );

        jobSeeker.similarity = percentageSimilarity;
        jobSeeker.corporatePreference = corporatePreferenceRating;
        return jobSeeker;
      }),
    );
    return results;
  }

  async remove(id: string) {
    try {
      const result = await this.jobSeekerRepository.delete({
        userId: id,
      });
      if (result.affected === 0) {
        throw new HttpException(
          'Job seeker id not found',
          HttpStatus.NOT_FOUND,
        );
      }
      return result;
    } catch (err) {
      throw new HttpException(
        'Failed to delete job seeker',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

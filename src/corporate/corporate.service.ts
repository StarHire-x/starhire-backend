import { CreateCorporateDto } from './dto/create-corporate.dto';
import { UpdateCorporateDto } from './dto/update-corporate.dto';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Corporate } from 'src/entities/corporate.entity';
import {
  mapNotificationModeToEnum,
  mapUserRoleToEnum,
  mapUserStatusToEnum,
} from 'src/common/mapStringToEnum';
import { JobSeeker } from 'src/entities/jobSeeker.entity';
import { EmailService } from 'src/email/email.service';
import { TwilioService } from 'src/twilio/twilio.service';
import NotificationModeEnum from 'src/enums/notificationMode.enum';
import UserRoleEnum from 'src/enums/userRole.enum';
import CorporatePromotionStatusEnum from 'src/enums/corporatePromotionStatus.enum';
import JobListingStatusEnum from 'src/enums/jobListingStatus.enum';
import { JobListing } from 'src/entities/jobListing.entity';
import { JobApplication } from 'src/entities/jobApplication.entity';

@Injectable()
export class CorporateService {
  constructor(
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
    @InjectRepository(JobListing)
    private readonly jobListingRepository: Repository<JobListing>,
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
    private emailService: EmailService,
    private twilioService: TwilioService,
  ) {}

  async create(createCorporateDto: CreateCorporateDto) {
    try {
      const corporate = new Corporate({ ...createCorporateDto });

      // Convert all ENUM values
      if (corporate.status) {
        corporate.status = mapUserStatusToEnum(corporate.status);
      }
      if (corporate.notificationMode) {
        corporate.notificationMode = mapNotificationModeToEnum(
          corporate.notificationMode,
        );
      }
      if (corporate.role) {
        corporate.role = mapUserRoleToEnum(corporate.role);
      }

      // check for duplicate UEN number
      // const findUEN = await this.corporateRepository.findOne({
      //   where: { companyRegistrationId: corporate.companyRegistrationId },
      // });

      // if (findUEN) {
      //   throw new ConflictException(
      //     `This UEN number ${corporate.companyRegistrationId} has already been used. Please use a different UEN number.`,
      //   );
      // }

      await this.corporateRepository.save(corporate);
      if (corporate) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Corporate created',
          data: corporate,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Corporate not created',
        };
      }
    } catch (error) {
      const { response } = error;
      if (response?.statusCode === 409) {
        throw new ConflictException(response.message);
      }

      throw new HttpException(
        'Failed to create new corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const corporates = await this.corporateRepository.find({
        relations: { chats: true },
      });
      if (corporates.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Corporate found',
          data: corporates,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Corporate not found',
          data: [],
        };
      }
    } catch {
      throw new HttpException(
        'Failed to find corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllJobStatistics() {
    const corporates = await this.corporateRepository.find({
      relations: { jobListings: true },
    });

    const statistics = {};

    for (const data of corporates) {
      const jobListings = data.jobListings;
      statistics[data.companyName] = jobListings.length;
    }

    const labels = Object.keys(statistics);
    const values = Object.values(statistics);

    const result = {
      labels: labels,
      values: values,
    };

    return {
      statusCode: HttpStatus.OK,
      message: 'Statistics retrieved',
      data: result,
    };
  }

  async findBreakdownJobStatistics() {
    const corporates = await this.corporateRepository.find({
      relations: { jobListings: true },
    });

    const statistics = {};

    let approvedCount = 0;
    let rejectedCount = 0;
    let unverifiedCount = 0;
    let archivedCount = 0;

    for (const data of corporates) {
      const jobListings = data.jobListings;
      const breakdown = {
        approved: 0,
        rejected: 0,
        unverified: 0,
        archived: 0,
      };
      breakdown.approved = jobListings.filter(
        (jobListing) =>
          jobListing.jobListingStatus === JobListingStatusEnum.APPROVED,
      ).length;
      breakdown.rejected = jobListings.filter(
        (jobListing) =>
          jobListing.jobListingStatus === JobListingStatusEnum.REJECTED,
      ).length;
      breakdown.unverified = jobListings.filter(
        (jobListing) =>
          jobListing.jobListingStatus === JobListingStatusEnum.UNVERIFIED,
      ).length;
      breakdown.archived = jobListings.filter(
        (jobListing) =>
          jobListing.jobListingStatus === JobListingStatusEnum.ARCHIVED,
      ).length;
      approvedCount += breakdown.approved;
      rejectedCount += breakdown.rejected;
      unverifiedCount += breakdown.unverified;
      archivedCount += breakdown.archived;
      statistics[data.companyName] = breakdown;
    }

    statistics['total'] = {
      approved: approvedCount,
      rejected: rejectedCount,
      unverified: unverifiedCount,
      archived: archivedCount,
    };

    return {
      statusCode: HttpStatus.OK,
      message: 'Statistics retrieved',
      data: statistics,
    };
  }

  async findBreakdownJobStatisticsOneCorporate(corporateId: string) {
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { userId: corporateId },
        relations: { jobListings: true },
      });

      if (!corporate) {
        throw new HttpException('Corporate not found', HttpStatus.NOT_FOUND);
      }

      const jobListings = corporate.jobListings;
      const breakdown = {
        approved: 0,
        rejected: 0,
        unverified: 0,
        archived: 0,
      };
      breakdown.approved = jobListings.filter(
        (jobListing) =>
          jobListing.jobListingStatus === JobListingStatusEnum.APPROVED,
      ).length;
      breakdown.rejected = jobListings.filter(
        (jobListing) =>
          jobListing.jobListingStatus === JobListingStatusEnum.REJECTED,
      ).length;
      breakdown.unverified = jobListings.filter(
        (jobListing) =>
          jobListing.jobListingStatus === JobListingStatusEnum.UNVERIFIED,
      ).length;
      breakdown.archived = jobListings.filter(
        (jobListing) =>
          jobListing.jobListingStatus === JobListingStatusEnum.ARCHIVED,
      ).length;

      return {
        statusCode: HttpStatus.OK,
        message: 'Statistics retrieved',
        data: breakdown,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { userId: id },
        relations: {
          eventListings: true,
          jobListings: {
            jobApplications: {
              recruiter: true,
              invoice: true,
              jobListing: true,
            },
          },
          chats: true,
          tickets: true,
          jobPreference: true,
          invoices: { jobApplications: { jobListing: true, recruiter: true } },
        },
      });
      if (!corporate) {
        throw new NotFoundException('Corporate Id provided is not valid');
      }
      return {
        statusCode: HttpStatus.OK,
        message: 'Corporate is found',
        data: corporate,
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  //Added code to handle different request
  async findByEmail(email: string) {
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { email },
      });

      if (corporate) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Corporate found',
          data: corporate,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Corporate not found',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to find corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  //Added code to handle different request
  async findByUserId(userId: string) {
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { userId },
      });

      if (corporate) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Corporate found',
          data: corporate,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Corporate not found',
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to find corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAllCorporatesSocial() {
    try {
      const corporates = await this.corporateRepository.find({
        relations: { followers: true },
      });
      if (corporates.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Corporate found',
          data: corporates,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Corporate not found',
        };
      }
    } catch {
      throw new HttpException(
        'Failed to find corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addFollower(corporateId: string, jobSeekerId: string) {
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { userId: corporateId },
        relations: { followers: true },
      });

      //console.log(corporate);

      if (!corporate) {
        throw new NotFoundException('Corporate Id provided is not valid');
      }

      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: jobSeekerId },
        relations: { following: true },
      });

      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      if (corporate && jobSeeker) {
        corporate.followers.push(jobSeeker);
        await this.corporateRepository.save(corporate);
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker is following corporate',
        };
      }
    } catch (error) {
      throw new HttpException(
        'Job seeker following process failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async removeFollower(corporateId: string, jobSeekerId: string) {
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { userId: corporateId },
        relations: ['followers'],
      });

      if (!corporate) {
        throw new NotFoundException('Corporate Id provided is not valid');
      }

      const jobSeeker = await this.jobSeekerRepository.findOne({
        where: { userId: jobSeekerId },
      });

      if (!jobSeeker) {
        throw new NotFoundException('Job Seeker Id provided is not valid');
      }

      if (corporate && jobSeeker) {
        // Remove the jobSeeker from the corporate's followers array
        corporate.followers = corporate.followers.filter(
          (follower) => follower.userId !== jobSeekerId,
        );

        await this.corporateRepository.save(corporate);
        return {
          statusCode: HttpStatus.OK,
          message: 'Job seeker has unfollowed the corporate',
        };
      }
    } catch (error) {
      throw new HttpException(
        'Unfollowing process failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, updatedCorporate: UpdateCorporateDto) {
    try {
      const corporate = await this.corporateRepository.findOneBy({
        userId: id,
      });

      if (!corporate) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Corporate id not found',
          data: [],
        };
      }

      const initialNotificationStatus = corporate.notificationMode;

      Object.assign(corporate, updatedCorporate);

      if (updatedCorporate.status) {
        corporate.status = mapUserStatusToEnum(updatedCorporate.status);
      }

      if (updatedCorporate.notificationMode) {
        corporate.notificationMode = mapNotificationModeToEnum(
          updatedCorporate.notificationMode,
        );
      }

      await this.corporateRepository.save(corporate);

      if (
        initialNotificationStatus === NotificationModeEnum.SMS &&
        corporate.notificationMode === NotificationModeEnum.EMAIL
      ) {
        await this.emailService.sendNotificationStatusEmail(
          corporate,
          UserRoleEnum.CORPORATE,
        );
      } else if (
        initialNotificationStatus === NotificationModeEnum.EMAIL &&
        corporate.notificationMode === NotificationModeEnum.SMS
      ) {
        await this.twilioService.sendNotificationStatusSMS(
          corporate,
          UserRoleEnum.CORPORATE,
        );
      }

      if (corporate) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Corporate updated',
          data: corporate,
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to update corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      return await this.corporateRepository.delete({ userId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete a corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getAllPromotionRequest() {
    try {
      const corporates = await this.corporateRepository.find({
        where: {
          corporatePromotionStatus: CorporatePromotionStatusEnum.REQUESTED,
        },
      });
      if (corporates.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Corporate found',
          data: corporates,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Corporate not found',
          data: [],
        };
      }
    } catch {
      throw new HttpException(
        'Failed to find corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getJobApplicationsForCorporate(corporateId: string) {
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { userId: corporateId },
        relations: {
          jobListings: true,
        },
      });

      if (!corporate) {
        throw new HttpException('Corporate is not found', HttpStatus.NOT_FOUND);
      }

      const formatResponse = await Promise.all(
        corporate.jobListings.map(async (jl) => {
          const jobListing = await this.jobListingRepository.findOne({
            where: { jobListingId: jl.jobListingId },
            relations: [
              'jobApplications',
              'jobApplications.jobSeeker',
              'jobApplications.recruiter',
            ],
          });

          console.log(jobListing.jobApplications);

          const jobApplications = await Promise.all(
            jobListing.jobApplications.map(async (ja) => {
              return {
                jobApplicationId: ja.jobApplicationId,
                jobApplicationStatus: ja.jobApplicationStatus,
                jobSeekerId: ja.jobSeeker.userId,
                jobSeekerName: ja.jobSeeker.fullName,
                jobSeekerProfilePic: ja.jobSeeker.profilePictureUrl,
                recruiterId: ja.recruiter.userId,
                recruiterName: ja.recruiter.fullName,
                recruiterProfilePic: ja.recruiter.profilePictureUrl,
              };
            }),
          );

          return {
            jobListingId: jobListing.jobListingId,
            jobListingTitle: jobListing.title,
            createdDate: jobListing.listingDate,
            jobApplications,
          };
        }),
      );

      return {
        statusCode: HttpStatus.OK,
        message: 'Statistics found',
        data: {
          formatResponse,
        },
      };
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  obtainDateByDayWeeksMonth() {
    const startDate = new Date('2023-08-27');
    const today = new Date();

    // Array for days
    const dateArrayInDays = [];
    let currentDate = new Date(startDate);
    while (currentDate <= today) {
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = currentDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const year = currentDate.getFullYear().toString().slice(-2);
      dateArrayInDays.push(`${day}-${month}-${year}`);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // Array for weeks
    const dateArrayByWeek = [];
    currentDate = new Date(startDate);
    while (currentDate <= today) {
      const startDay = currentDate.getDate().toString().padStart(2, '0');
      const startMonth = currentDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const startYear = currentDate.getFullYear().toString().slice(-2);

      // Calculate the end date of the week
      let endDate = new Date(currentDate);
      endDate.setDate(endDate.getDate() + 6);
      if (endDate > today) {
        endDate = today;
      }

      const endDay = endDate.getDate().toString().padStart(2, '0');
      const endMonth = endDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const endYear = endDate.getFullYear().toString().slice(-2);

      // Add the week to the array
      dateArrayByWeek.push(
        `${startDay}-${startMonth}-${startYear} to ${endDay}-${endMonth}-${endYear}`,
      );

      // Increment the date
      currentDate.setDate(currentDate.getDate() + 7);
    }

    // Array for months
    const dateArrayInMonths = [];
    currentDate = new Date(startDate);
    while (currentDate <= today) {
      const month = currentDate
        .toLocaleString('en-us', { month: 'short' })
        .toUpperCase();
      const year = currentDate.getFullYear().toString().slice(-2);
      const monthYear = `${month}-${year}`;
      if (!dateArrayInMonths.includes(monthYear)) {
        dateArrayInMonths.push(monthYear);
      }
      currentDate.setDate(1); // Set to the 1st to prevent rollover
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return {
      dateArrayInDays,
      dateArrayByWeek,
      dateArrayInMonths,
    };
  }

  formatDateByMonth(isoString) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(isoString);
    const month = months[date.getMonth()].toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    return `${month}-${year}`;
  }

  formatDateByDay(isoString) {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const date = new Date(isoString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = months[date.getMonth()].toUpperCase();
    const year = date.getFullYear().toString().slice(-2);
    return `${day}-${month}-${year}`;
  }

  formatDateByWeek(isoString, reference) {
    const targetDate = new Date(isoString);

    for (let range of reference) {
      const [start, end] = range.split(' to ');
      const startDate = this.parseDate(start);
      const endDate = this.parseDate(end);

      if (targetDate >= startDate && targetDate <= endDate) {
        return range;
      }
    }

    return 'Date out of range';
  }

  parseDate(dateString) {
    const [day, month, year] = dateString.split('-');
    const months = {
      JAN: 0,
      FEB: 1,
      MAR: 2,
      APR: 3,
      MAY: 4,
      JUN: 5,
      JUL: 6,
      AUG: 7,
      SEP: 8,
      OCT: 9,
      NOV: 10,
      DEC: 11,
    };
    return new Date(
      global.Number(`20${year}`),
      months[month],
      global.Number(day),
    );
  }

  async findAllJobListingStatsByCorporate(userId: string) {
    try {
      const userData = await this.corporateRepository.findOne({
        where: { userId },
        relations: ['jobListings'],
      });

      if (!userData) {
        throw new HttpException(
          'Corporate Id provided is not valid',
          HttpStatus.NOT_FOUND,
        );
      }

      let statistics = {};

      const result = this.obtainDateByDayWeeksMonth();
      const month = result.dateArrayInMonths;
      const day = result.dateArrayInDays;
      const weeks = result.dateArrayByWeek;

      // Single pass to calculate all statistics
      for (const data of userData.jobListings) {
        const monthSum = this.formatDateByMonth(data.listingDate);
        const daySum = this.formatDateByDay(data.listingDate);
        const weekSum = this.formatDateByWeek(data.listingDate, weeks);

        statistics[monthSum] = (statistics[monthSum] || 0) + 1;
        statistics[daySum] = (statistics[daySum] || 0) + 1;
        statistics[weekSum] = (statistics[weekSum] || 0) + 1;
      }

      const userStatistics = {
        month: {
          labels: month,
          data: month.map((label: string) => statistics[label] || 0),
        },
        day: {
          labels: day,
          data: day.map((label: string) => statistics[label] || 0),
        },
        week: {
          labels: weeks,
          data: weeks.map((label: string) => statistics[label] || 0),
        },
      };

      return {
        statusCode: HttpStatus.OK,
        message: 'User statistics retrieved',
        data: userStatistics,
      };
    } catch (err) {
      throw new HttpException(
        'Unfollowing process failed',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

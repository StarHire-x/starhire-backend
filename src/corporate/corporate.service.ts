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

@Injectable()
export class CorporateService {
  constructor(
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
    @InjectRepository(JobSeeker)
    private readonly jobSeekerRepository: Repository<JobSeeker>,
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

  async findOne(id: string) {
    try {
      const corporate = await this.corporateRepository.findOne({
        where: { userId: id },
        relations: {
          eventListings: true,
          jobListings: true,
          chats: true,
          tickets: true,
          // reviews: true,
        },
      });
      return corporate;
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
}

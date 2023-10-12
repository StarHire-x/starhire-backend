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

@Injectable()
export class RecruiterService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
    private emailService: EmailService,
    private twilioService: TwilioService,
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
      const recruiters = await this.recruiterRepository.find();
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

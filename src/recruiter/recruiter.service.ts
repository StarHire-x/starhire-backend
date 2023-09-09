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
import NotificationModeEnum from 'src/enums/notificationMode.enum';
import UserStatusEnum from 'src/enums/userStatus.enum';
import UserRoleEnum from 'src/enums/userRole.enum';

@Injectable()
export class RecruiterService {
  constructor(
    @InjectRepository(Recruiter)
    private readonly recruiterRepository: Repository<Recruiter>,
  ) {}

  async create(createRecruiterDto: CreateRecruiterDto) {
    try {
      const recruiter = new Recruiter({ ...createRecruiterDto });

      // Convert all ENUM values
      if (recruiter.status) {
        recruiter.status = this.mapStatusToEnum(recruiter.status);
      }
      if (recruiter.notificationMode) {
        recruiter.notificationMode = this.mapNotificationToEnum(
          recruiter.notificationMode,
        );
      }
      if (recruiter.role) {
        recruiter.role = this.mapRoleToEnum(recruiter.role);
      }
      return await this.recruiterRepository.save(recruiter);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
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
          data: [],
        };
      }
    } catch (err) {
      throw new HttpException(
        'Failed to find recruiter',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: number) {
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

  async update(id: number, updatedRecruiter: UpdateRecruiterDto) {
    try {
      const recruiter = await this.recruiterRepository.findOneBy({
        userId: id,
      });

      if (!recruiter) {
        throw new NotFoundException('Recruiter User Id provided is not valid');
      }

      Object.assign(recruiter, updatedRecruiter);

      return await this.recruiterRepository.save(recruiter);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      return await this.recruiterRepository.delete({ userId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete a recruiter',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  mapNotificationToEnum(status: string): NotificationModeEnum {
    switch (status.toLowerCase()) {
      case 'sms':
        return NotificationModeEnum.SMS;
      default:
        return NotificationModeEnum.EMAIL;
    }
  }
  mapStatusToEnum(status: string): UserStatusEnum {
    switch (status.toLowerCase()) {
      case 'inactive':
        return UserStatusEnum.INACTIVE;
      default:
        return UserStatusEnum.ACTIVE;
    }
  }
  mapRoleToEnum(status: string): UserRoleEnum {
    switch (status.toLowerCase()) {
      case 'recruiter':
        return UserRoleEnum.RECRUITER;
      case 'corporate':
        return UserRoleEnum.CORPORATE;
      case 'administrator':
        return UserRoleEnum.ADMINISTRATOR;
      default:
        return UserRoleEnum.JOBSEEKER;
    }
  }
}

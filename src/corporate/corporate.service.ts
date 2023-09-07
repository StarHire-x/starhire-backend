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
import { EventListing } from 'src/entities/eventListing.entity';
import { JobListing } from 'src/entities/jobListing.entity';
import HighestEducationStatusEnum from 'src/enums/highestEducationStatus.enum';
import UserStatusEnum from 'src/enums/userStatus.enum';
import NotificationModeEnum from 'src/enums/notificationMode.enum';
import UserRoleEnum from 'src/enums/userRole.enum';

@Injectable()
export class CorporateService {
  constructor(
    @InjectRepository(Corporate)
    private readonly corporateRepository: Repository<Corporate>,
  ) {}

  async create(createCorporateDto: CreateCorporateDto) {
    try {
      const corporate = new Corporate({ ...createCorporateDto });

      // Convert all ENUM values
      if (corporate.status) {
        corporate.status = this.mapStatusToEnum(corporate.status);
      }
      if (corporate.notificationMode) {
        corporate.notificationMode = this.mapNotificationToEnum(
          corporate.notificationMode,
        );
      }
      if (corporate.role) {
        corporate.role = this.mapRoleToEnum(corporate.role);
      }
      return await this.corporateRepository.save(corporate);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.corporateRepository.find();
  }

  async findOne(id: number) {
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

  async update(id: number, updatedCorporate: UpdateCorporateDto) {
    try {
      const corporate = await this.corporateRepository.findOneBy({
        userId: id,
      });

      if (!corporate) {
        throw new NotFoundException('Corporate User Id provided is not valid');
      }

      Object.assign(corporate, updatedCorporate);

      return await this.corporateRepository.save(corporate);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async remove(id: number) {
    try {
      return await this.corporateRepository.delete({ userId: id });
    } catch (err) {
      throw new HttpException(
        'Failed to delete a corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  mapEducationToEnum(status: string): HighestEducationStatusEnum {
    switch (status.toLowerCase()) {
      case 'no_school':
        return HighestEducationStatusEnum.NO_SCHOOL;
      case 'high_school':
        return HighestEducationStatusEnum.HIGH_SCHOOL;
      case 'bachelor':
        return HighestEducationStatusEnum.BACHELOR;
      case 'master':
        return HighestEducationStatusEnum.MASTER;
      case 'doctorate':
        return HighestEducationStatusEnum.DOCTORATE;
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

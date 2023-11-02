import {
  Injectable,
  HttpException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-admin.dto';
import { UpdateAdministratorDto } from './dto/update-admin.dto';
import { Repository } from 'typeorm';
import { Administrator } from '../entities/administrator.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailService } from '../email/email.service';
import {
  mapNotificationModeToEnum,
  mapUserStatusToEnum,
} from '../common/mapStringToEnum';
import NotificationModeEnum from '../enums/notificationMode.enum';
import UserRoleEnum from '../enums/userRole.enum';
import { TwilioService } from '../twilio/twilio.service';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
    private emailService: EmailService,
    private twilioService: TwilioService,
  ) {}

  async create(createAdministratorDto: CreateAdministratorDto) {
    try {
      const admin = new Administrator({ ...createAdministratorDto });
      await this.administratorRepository.save(admin);
      if (admin) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Admin created',
          data: admin,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Admin not created',
        };
      }
    } catch (error) {
      throw new HttpException(
        'Failed to create new administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    try {
      const admins = await this.administratorRepository.find();
      if (admins.length > 0) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Admin found',
          data: admins,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Admin not found',
          data: [],
        };
      }
    } catch {
      throw new HttpException('Failed to find admin', HttpStatus.BAD_REQUEST);
    }
  }

  async findOne(id: string) {
    try {
      return await this.administratorRepository.findOne({
        where: { userId: id },
        relations: { tickets: true },
      });
    } catch (error) {
      throw new HttpException(
        'Failed to find administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findByEmail(email: string) {
    try {
      const admin = await this.administratorRepository.findOne({
        where: { email },
      });

      if (admin) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Admin found',
          data: admin,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Admin not found',
        };
      }
    } catch (err) {
      console.error('Failed to find admin by email', err); // This logs the error for debugging.
      throw new HttpException(
        'An error occurred while trying to find the admin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findByUserId(userId: string) {
    try {
      const admin = await this.administratorRepository.findOne({
        where: { userId },
      });

      if (admin) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Admin found',
          data: admin,
        };
      } else {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Admin not found',
        };
      }
    } catch (err) {
      console.error('Failed to find admin by email', err); // This logs the error for debugging.
      throw new HttpException(
        'An error occurred while trying to find the admin',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateAdministratorDto: UpdateAdministratorDto) {
    try {
      const administrator = await this.administratorRepository.findOneBy({
        userId: id,
      });

      if (!administrator) {
        return {
          statusCode: HttpStatus.NOT_FOUND,
          message: 'Administrator not updated',
          data: [],
        };
      }

      const initialNotificationStatus = administrator.notificationMode;

      Object.assign(administrator, updateAdministratorDto);

      if (updateAdministratorDto.status) {
        administrator.status = mapUserStatusToEnum(
          updateAdministratorDto.status,
        );
      }

      if (updateAdministratorDto.notificationMode) {
        administrator.notificationMode = mapNotificationModeToEnum(
          updateAdministratorDto.notificationMode,
        );
      }

      await this.administratorRepository.save(administrator);

      if (
        initialNotificationStatus === NotificationModeEnum.SMS &&
        administrator.notificationMode === NotificationModeEnum.EMAIL
      ) {
        await this.emailService.sendNotificationStatusEmail(
          administrator,
          UserRoleEnum.ADMINISTRATOR,
        );
      } else if (
        initialNotificationStatus === NotificationModeEnum.EMAIL &&
        administrator.notificationMode === NotificationModeEnum.SMS
      ) {
        await this.twilioService.sendNotificationStatusSMS(
          administrator,
          UserRoleEnum.ADMINISTRATOR,
        );
      }

      if (administrator) {
        return {
          statusCode: HttpStatus.OK,
          message: 'Administrator updated',
          data: administrator,
        };
      }
    } catch (error) {
      throw new HttpException(
        'Failed to update administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const result = await this.administratorRepository.delete({
        userId: id,
      });
      if (result.affected === 0) {
        throw new HttpException('Admin id not found', HttpStatus.NOT_FOUND);
      }
      return result;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
}

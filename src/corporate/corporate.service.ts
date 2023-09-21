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
      const findUEN = await this.corporateRepository.findOne({
        where: { companyRegistrationId: corporate.companyRegistrationId }
      });

      if (findUEN) {
        throw new ConflictException(`This UEN number ${corporate.companyRegistrationId} has already been used. Please use a different UEN number.`);
      }

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

      Object.assign(corporate, updatedCorporate);

      await this.corporateRepository.save(corporate);

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

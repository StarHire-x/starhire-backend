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
}

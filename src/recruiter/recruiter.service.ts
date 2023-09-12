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
}

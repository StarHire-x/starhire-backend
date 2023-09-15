import {
  Injectable,
  HttpException,
  NotFoundException,
  HttpStatus,
} from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-admin.dto';
import { UpdateAdministratorDto } from './dto/update-admin.dto';
import { Repository } from 'typeorm';
import { Administrator } from 'src/entities/administrator.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
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
      throw new HttpException(
        'Failed to find admin',
        HttpStatus.BAD_REQUEST,
      );
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

      Object.assign(administrator, updateAdministratorDto);
      await this.administratorRepository.save(administrator);

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
      return await this.administratorRepository.delete({
        userId: id,
      });
    } catch (error) {
      throw new HttpException(
        'Failed to delete administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}

import { Injectable, HttpException, NotFoundException, HttpStatus } from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-admin.dto';
import { UpdateAdministratorDto } from './dto/update-admin.dto';
import { Repository } from 'typeorm';
import { Administrator } from 'src/entities/administrator.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AdministratorService {
  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>
    ) {}

  async create(createAdministratorDto: CreateAdministratorDto) {
    try {
      return await this.administratorRepository.save(createAdministratorDto);

    } catch (error) {
      throw new HttpException(
        'Failed to create new administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {
    return await this.administratorRepository.find();
  }

  async findOne(id: number) {
    try {
      return await this.administratorRepository.findOne({
        where:{ userId: id },
        relations: {tickets: true}, 
      });
    } catch (error) {
      throw new HttpException(
        'Failed to find administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateAdministratorDto: UpdateAdministratorDto) {
    try {
      const administrator = await this.administratorRepository.findOneBy({
        userId: id,
      });

      if (!administrator) {
        throw new NotFoundException('Administrator Id provided is not valid');
      }

      Object.assign(administrator, updateAdministratorDto);
      return await this.administratorRepository.save(administrator);

    } catch (error) {
      throw new HttpException(
        'Failed to update administrator',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: number) {
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

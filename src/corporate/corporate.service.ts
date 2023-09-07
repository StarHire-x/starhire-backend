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

@Injectable()
export class CorporateService {
  constructor(
    @InjectRepository(Corporate)
    private corporateRepository: Repository<Corporate>,
  ) {}

  async create(createCorporateDto: CreateCorporateDto) {
    try {
      const corporate = new Corporate({ ...createCorporateDto });
      return await this.corporateRepository.save(corporate);
    } catch (err) {
      throw new HttpException(
        'Failed to create new corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll() {}

  async findOne(id: number) {}

  async findByEmail(email: string) {
    try {
      return await this.corporateRepository.findOne({
        where: { email },
      });
    } catch (err) {
      throw new HttpException(
        'Failed to find corporate',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: number, updateCorporateDto: UpdateCorporateDto) {}

  async remove(id: number) {}
}




import { CreateCorporateDto } from './dto/create-corporate.dto';
import { UpdateCorporateDto } from './dto/update-corporate.dto';
import {
  ConflictException,
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
    
  }

  async findAll() {
    
  }

  async findOne(id: number) {
    
  }

  async update(id: number, updateCorporateDto: UpdateCorporateDto) {
    
  }

  async remove(id: number) {
    
  }
}




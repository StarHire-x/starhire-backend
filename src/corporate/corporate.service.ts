import { CreateCorporateDto } from './dto/create-corporate.dto';
import { UpdateCorporateDto } from './dto/update-corporate.dto';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CorporateRepo } from './corporate.repo';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class CorporateService {
  constructor(private readonly corporateRepo: CorporateRepo) {}

  async create(createCorporateDto: CreateCorporateDto) {
    try {
      const { ...corporateDetail } = createCorporateDto;
      return await this.corporateRepo.createCorporate(corporateDetail);
    } catch (err) {
      throw new ConflictException(
        'Inserting a duplicate entry into the database. Please check your data.',
      );
    }
  }

  async findAll() {
    return await this.corporateRepo.findAllCorporates();
  }

  async findOne(id: number) {
    const corporate = await this.corporateRepo.findOneCorporate(id);
    if (corporate === null) {
      throw new NotFoundException(`User with ID ${id} not found`);
    } else {
      return corporate;
    }
  }

  async update(id: number, updateCorporateDto: UpdateCorporateDto) {
    const user = await this.corporateRepo.findOneCorporate(id);
    if (user === null) {
      throw new NotFoundException(
        `User with ID ${id} not found, Update Unsuccessful`,
      );
    } else {
      return await this.corporateRepo.updateCorporate(id, updateCorporateDto);
    }
  }

  async remove(id: number) {
    const user = await this.corporateRepo.findOneCorporate(id);
    if (user === null) {
      throw new NotFoundException(
        `User with ID ${id} not found, Delete Unsuccessful`,
      );
    } else {
      return await this.corporateRepo.deleteCorporate(id);
    }
  }
}



